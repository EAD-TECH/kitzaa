"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { socket } from "@/features/socket/socket";
import { useSupport } from "@/features/socket/store/useSupport";
import type { SupportMessage } from "@/features/socket/types";

export default function SupportChat() {
  const messages = useSupport((state) => state.supportMessages);
  const supportRoomId = useSupport((state) => state.supportRoomId);
  const setSupportRoomId = useSupport((state) => state.setSupportRoomId);
  const addSupportMessage = useSupport((state) => state.addSupportMessage);
  const [messageInput, setMessageInput] = useState("");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSupportMessage = (message: SupportMessage) => {
      setSupportRoomId(message.roomId);
      addSupportMessage(message);
    };

    const handleStandardMessage = (message: SupportMessage) => {
      addSupportMessage(message);
    };
    const handleSessionReady = (data: { roomId: string }) => {
      setSupportRoomId(data.roomId);
    };

    socket.on("receive_support_message", handleSupportMessage);
    socket.on("receive_message", handleStandardMessage);
    socket.on("support_session_ready", handleSessionReady);

    return () => {
      socket.off("receive_support_message", handleSupportMessage);
      socket.off("receive_message", handleStandardMessage);
      socket.off("support_session_ready", handleSessionReady);
    };
  }, [addSupportMessage, setSupportRoomId]);

  useEffect(() => {
    const viewport = listRef.current?.parentElement;
    if (!viewport || !open) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages, open]);

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text) return;

    if (supportRoomId) {
      socket.emit("send_message", {
        roomId: supportRoomId,
        receiverId: "",
        text,
      });
    } else {
      socket.emit("request_support", { text });
    }

    setMessageInput("");
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(32rem,calc(100dvh-7rem))] w-[min(22.5rem,calc(100vw-3rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
          <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="size-4" />
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-popover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Support</p>
              <p className="truncate text-xs text-muted-foreground">
                Zuerst antwortet der Assistent
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Chat schließen"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div ref={listRef} className="flex min-h-full flex-col gap-2 px-4 py-4">
              {messages.length === 0 ? (
                <div className="my-auto flex flex-col items-center px-4 py-10 text-center">
                  <p className="text-sm font-medium">Hallo, ich bin der Kitzaa Assistent.</p>
                  <p className="mt-1 max-w-56 text-xs leading-relaxed text-muted-foreground">
                    Wobei kann ich dir helfen? Bei einer ausstehenden Freigabe, einer Beschwerde oder wenn du eine Person sprechen möchtest, verbinde ich dich mit dem Team.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isMe = message.senderType === "user";
                  const previous = messages[index - 1];
                  const showName = !isMe && previous?.senderName !== message.senderName;

                  return (
                    <div
                      key={message.id}
                      className={cn("flex", isMe ? "justify-end" : "justify-start")}
                    >
                      <div className={cn("max-w-[80%]", showName && "mt-1")}>
                        {showName && (
                          <p className="mb-1 px-1 text-xs text-muted-foreground">
                            {message.senderName}
                          </p>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-3 py-2 text-sm leading-relaxed wrap-break-word",
                            isMe
                              ? "rounded-br-md bg-primary text-primary-foreground"
                              : "rounded-bl-md bg-muted text-foreground"
                          )}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <form
            className="shrink-0 border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage();
            }}
          >
            <InputGroup>
              <InputGroupInput
                value={messageInput}
                placeholder="Nachricht schreiben…"
                onChange={(event) => setMessageInput(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  variant="default"
                  disabled={!messageInput.trim()}
                  aria-label="Senden"
                >
                  <Send />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
      )}

      <Button
        type="button"
        size="icon-lg"
        className="size-14 rounded-full shadow-lg"
        aria-expanded={open}
        aria-label={open ? "Chat schließen" : "Support-Chat öffnen"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}

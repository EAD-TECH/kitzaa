"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/features/socket/socket";
import { useSupport } from "@/features/socket/store/useSupport";
import type { SupportMessage } from "@/features/socket/types";

export default function SupportChat() {
  const messages = useSupport((state) => state.supportMessages);
  const supportRoomId = useSupport((state) => state.supportRoomId);
  const setSupportRoomId = useSupport((state) => state.setSupportRoomId);
  const addSupportMessage = useSupport((state) => state.addSupportMessage);
  const clearSupportSession = useSupport((state) => state.clearSupportSession);
  const [messageInput, setMessageInput] = useState("");

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
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-muted/40">
      <ScrollArea className="min-h-0 flex-1 bg-transparent">
        <div className="flex flex-col gap-3 px-3 py-3">
          {messages.map((message) => {
            const isMe = message.senderType === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    isMe
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  <p className="mb-1 text-xs font-medium opacity-70">
                    {message.senderName}
                  </p>
                  <p className="wrap-break-word">{message.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-3 py-2.5">
        <Input
          type="text"
          placeholder="Mesajınızı yazın..."
          className="min-w-0 flex-1"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSendMessage();
          }}
        />
        <Button type="button" onClick={handleSendMessage} size="icon">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

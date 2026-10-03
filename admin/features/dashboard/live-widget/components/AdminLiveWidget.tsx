"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSocketConnection } from "@/features/dashboard/live-widget/hooks/useSocketConnections";
import { useLiveWidgetStore } from "@/features/dashboard/live-widget/store/useLiveWidgetStore";
import { cn } from "@/lib/utils";
import { socket } from "@/providers/auth.socket.providers";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Eye,
  Heart,
  MessageCircle,
  X,
  UserPlus,
  Send,
  MapPin,
  CalendarCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ActivityLog } from "@/features/dashboard/live-widget/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function getActivityHref(notify: ActivityLog): string | null {
  const type = notify.type as string;
  if (!notify.relatedId) return null;

  if (type === "event_join" || type === "event_application") {
    return `/events?applicationId=${notify.relatedId}`;
  }

  if (type === "application") {
    return `/organizer-applications?applicationId=${notify.relatedId}`;
  }

  return null;
}

/* olay tıpıne gore renk ve ıkon */
const getEvents = (type: string) => {
  switch (type) {
    case "page_view":
      return {
        icon: <Eye className="w-4 h-4" />,
        bg: "bg-muted",
        text: "text-muted-foreground",
      };
    case "like":
      return {
        icon: <Heart className="w-4 h-4" />,
        bg: "bg-secondary/15",
        text: "text-secondary",
      };
    case "signup":
      return {
        icon: <UserPlus className="w-4 h-4" />,
        bg: "bg-primary/10",
        text: "text-primary",
      };
    case "application":
      return {
        icon: <CalendarDays className="w-4 h-4" />,
        bg: "bg-primary/10",
        text: "text-primary",
      };

    case "event_join":
      return {
        icon: <CalendarCheck className="w-4 h-4" />,
        bg: "bg-secondary/15",
        text: "text-secondary",
      };
    default:
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bg: "bg-muted",
        text: "text-muted-foreground",
      };
  }
};

export default function AdminLiveWidget() {
  const activities = useLiveWidgetStore((state) => state.activities);
  useSocketConnection();

  const onlineUsersList = useLiveWidgetStore((state) => state.onlineUsers);

  const setOnlineUsers = useLiveWidgetStore((state) => state.setOnlineUsers);
  const setSelectedUser = useLiveWidgetStore((state) => state.setSelectedUser);
  const selectedUser = useLiveWidgetStore((state) => state.selectedUser);
  const clearChatMessages = useLiveWidgetStore(
    (state) => state.clearChatMessage,
  );

  const activeConversationRoomId = useLiveWidgetStore(
    (state) => state.activeConversationRoomId,
  );
  const setActiveConversationRoomId = useLiveWidgetStore(
    (state) => state.setactiveConversationRoomId,
  );
  const messages = useLiveWidgetStore((state) => state.chatMessages);
  const addMessage = useLiveWidgetStore((state) => state.addChatMessage);
  const markActivityAsRead = useLiveWidgetStore(
    (state) => state.markActivityAsRead,
  );
  const router = useRouter();

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    console.log("click calısıyormu enterlayınca");
    if (!messageInput.trim() || !activeConversationRoomId) return;
    if (!messageInput.trim()) return;

    /* eger doluysa emitle  */

    socket.emit("send_message", {
      roomId: activeConversationRoomId,
      receiverId: selectedUser?.id,
      text: messageInput,
    });
    console.log("emit twtıklenıyoemu");
    setMessageInput("");
  };

  useEffect(() => {
    const handleChatReady = (data: any) => {
      /* tıkladıgm kısının id simi */
      const currentSelectedUser = useLiveWidgetStore.getState().selectedUser;
      if (currentSelectedUser && data.targetId === currentSelectedUser.id) {
        console.log(" EŞLEŞME BAŞARILI! Odaya giriliyor:", data.conversationId);
        setActiveConversationRoomId(data.conversationId);
      } else {
        console.log("EŞLEŞME HATASI var");
      }
    };

    const handleReceiveMessage = (newMessage: any) => {
      /* gelen mesaj acık olan odaya mı ait */
      const currentRoomId =
        useLiveWidgetStore.getState().activeConversationRoomId;
      if (newMessage.roomId === currentRoomId) {
        addMessage(newMessage);
      }
    };

    const handleLoadHistory=(historyData:any[])=>{
      /* once ekranı temızleme */
      clearChatMessages()
      historyData.map((msg)=>{
        addMessage(msg)
      })
    }

    socket.on("chat_session_ready", handleChatReady);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("load_chat_history",handleLoadHistory)

    return () => {
      socket.off("chat_session_ready", handleChatReady);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  console.log(
    "GÜNCEL DURUM - Seçili Kullanıcı:",
    selectedUser?.firstName,
    "Oda Şifresi:",
    activeConversationRoomId,
  );
  const closeChat = () => {
    if (activeConversationRoomId) {
      socket.emit("leave_chat_room", { roomId: activeConversationRoomId });
    }
    clearChatMessages();
    setSelectedUser(null);
    setActiveConversationRoomId(null);
  };

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
        <h3 className="font-heading text-sm font-medium text-foreground">
          Canlı Akış
        </h3>
      </div>
      {selectedUser ? (
        <>
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={closeChat}
                aria-label="Canlı akışa geri dön"
                title="Geri dön"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <h3 className="truncate text-sm font-semibold text-foreground">
                {selectedUser.firstName} {selectedUser.lastName}
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={closeChat}
              aria-label="Sohbeti kapat"
              title="Sohbeti kapat"
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-muted/40">
            <MessageScrollerProvider>
              <MessageScroller className="flex-1 bg-transparent">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="gap-3 px-3 py-3 ">
                    {messages.map((msg) => {
                      const isMe =
                        msg.senderType === "admin" &&
                        msg.senderId !== "Kitzaa-ai";

                      return (
                        <Message key={msg.id} align={isMe ? "end" : "start"}>
                          <MessageAvatar>
                            <Avatar className="size-8">
                              <AvatarImage
                                src={isMe ? undefined : selectedUser?.avatarUrl}
                                alt={msg.senderName}
                              />
                              <AvatarFallback>
                                {msg.senderName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </MessageAvatar>
                          <MessageContent>
                            <MessageHeader>{msg.senderName}</MessageHeader>
                            <Bubble
                              variant={isMe ? "default" : "muted"}
                              align={isMe ? "end" : "start"}
                            >
                              <BubbleContent>{msg.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      );
                    })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
              </MessageScroller>
            </MessageScrollerProvider>
            <div className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-3 py-2.5">
              <Input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="min-w-0 flex-1 "
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                type="button"
                onClick={() => handleSendMessage()}
                variant="default"
                size="icon"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Tabs
          defaultValue="bildirimler"
          className="flex min-h-0 w-full flex-1 flex-col bg-card"
        >
          <TabsList
            variant="default"
            className="w-full shrink-0 rounded-none border-b border-border bg-card px-2"
          >
            <TabsTrigger className="flex-1 py-2" value="bildirimler">
              Bildirimler
            </TabsTrigger>
            <TabsTrigger className="flex-1 py-2" value="online">
              Online
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="min-h-0 flex-1 bg-transparent">
            <TabsContent value="bildirimler" className="m-0 p-0 outline-none">
              {activities.map((notify) => {
                const style = getEvents(notify.type);
                return (
                  <button
                    type="button"
                    key={notify.id}
                    className="flex w-full flex-row items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-accent"
                    onClick={() => {
                      markActivityAsRead(notify.id);
                      const type = notify.type as string;

                      if (type === "system-alert" || type === "system_alert") {
                        if (activeConversationRoomId) {
                          socket.emit("leave_chat_room", {
                            roomId: activeConversationRoomId,
                          });
                        }
                        clearChatMessages();
                        setSelectedUser({
                          id: notify.userId,
                          firstName: "Destek",
                          lastName: "Talebi",
                          currentPath: "",
                          role: "user",
                        });
                        setActiveConversationRoomId(notify.relatedId);
                        socket.emit("join_chat_room", {
                          roomId: notify.relatedId,
                        });
                        return;
                      }

                      const href = getActivityHref(notify);
                      if (href) router.push(href);
                    }}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
                    >
                      {style.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm">
                        <span className="mr-1 font-medium text-foreground">
                          {notify.title}
                        </span>
                        <span className="text-muted-foreground">
                          {notify.description}
                        </span>
                      </p>

                      <span className="mt-1 text-xs text-muted-foreground">
                        {notify.time}
                      </span>
                    </div>
                    {!notify.isRead && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </TabsContent>
            <TabsContent value="online" className="m-0 outline-none">
              {onlineUsersList.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    closeChat();
                    setSelectedUser(user);
                    socket.emit("request_chat_session", { targetId: user.id });
                  }}
                  className="group flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-accent"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback className="text-xs text-muted-foreground">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full",
                        "bg-secondary ring-2 ring-card",
                      )}
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate text-sm font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.role}
                    </span>
                    {user.currentPath && (
                      <Badge
                        variant="outline"
                        className="mt-1 max-w-full gap-1 px-1.5 py-0 text-[10px] text-muted-foreground"
                      >
                        <MapPin className="size-3 shrink-0" />
                        <span className="truncate">{user.currentPath}</span>
                      </Badge>
                    )}
                  </div>

                  <MessageCircle className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </button>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </>
  );
}

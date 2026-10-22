"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import type {
  ListNotificationsResponse,
  NotificationDTO,
  UnreadCountResponse,
} from "@/features/notifications/types";

import { socket } from "@/features/socket/socket";
import { useSupport } from "@/features/socket/store/useSupport";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const accessToken = useAuthStore((state) => state.accessToken);
  const setIsSocketConnected = useAuthStore(
    (state) => state.setIsSocketConnected,
  );
  const queryClient = useQueryClient();
  const clearSupportSession = useSupport((state) => state.clearSupportSession);

  /* salterim  useeffect*/
  useEffect(() => {
    clearSupportSession();
    const handleConnect = () => {
      setIsSocketConnected(true);
      socket.emit("update_path", pathname);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    const handleChatInvite = (payload: { roomId: string }) => {
      socket.emit("join_chat_room", { roomId: payload.roomId });
    };

    const handleConnectError = () => {
      setIsSocketConnected(false);
    };

    const handleNotification = (yenibildirim: NotificationDTO) => {
      const targetPath = yenibildirim.linkNotification || "/notifications";

      toast("Yeni Bildirim ", {
        description: yenibildirim.title || "Sistemden yeni bir mesajınız var.",
        action: yenibildirim.linkNotification
          ? {
              label: "Görüntüle",
              onClick: () => router.push(targetPath),
            }
          : undefined,
      });

      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        (eskiData) => {
          if (!eskiData || !eskiData.data) {
            return { error: false, data: { count: 1 } };
          }

          return {
            ...eskiData,
            data: {
              ...eskiData.data,
              count: eskiData.data.count + 1,
            },
          };
        },
      );

      queryClient.setQueryData<InfiniteData<ListNotificationsResponse>>(
        ["notifications", "list"],
        (eskiData) => {
          if (!eskiData || eskiData.pages.length === 0) return eskiData;

          const [ilkSayfa, ...digerSayfalar] = eskiData.pages;
          return {
            ...eskiData,
            pages: [
              { ...ilkSayfa, result: [yenibildirim, ...ilkSayfa.result] },
              ...digerSayfalar,
            ],
          };
        },
      );
    };

    if (accessToken) {
      /* sockete tokenı ve baglantıyı kur */
      socket.auth = { token: accessToken };
      socket.connect();

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("chat_invite", handleChatInvite);
      socket.on("connect_error", handleConnectError);
      socket.on("notification:new", handleNotification);
    } else {
      socket.auth = {};
      socket.connect();
      setIsSocketConnected(false);
    }

    /* cleanup */
    return () => {
      /* memory sızıntısı sorununa karsın */
      /* bileşen ekrandan gıttı : kapanma, sayfa degısımı gıbı */
      /* frekansı dınlemeyı bırak ve baglantıyı kes dıyorum */
      socket.off("notification:new", handleNotification);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat_invite", handleChatInvite);
      socket.off("connect_error", handleConnectError);
      setIsSocketConnected(false);
      socket.disconnect();
    };
  }, [accessToken, clearSupportSession, queryClient]);

  const isSocketConnected = useAuthStore((state) => state.isSocketConnected);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("update_path", pathname);
    }
  }, [pathname, isSocketConnected]);

  //* cocukları ekrana bas */
  return <>{children}</>;
}

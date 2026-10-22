"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { NotificationDTO } from "@/features/notifications/types/notification";

const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const socket = io(URL, { autoConnect: false });

export default function AuthSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setIsSocketConnected = useAuthStore(
    (state) => state.setIsSocketConnected,
  );
  const queryClient = useQueryClient();

  /* salterim  useeffect*/
  useEffect(() => {
    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    const handleConnectError = () => {
      setIsSocketConnected(false);
    };

    const handleNotification = (yenibildirim: NotificationDTO) => {
      const targetPath = yenibildirim.linkNotification;

      toast("Yeni Bildirim ", {
        description: yenibildirim.title || "Sistemden yeni bir mesajınız var.",
        action: targetPath
          ? {
              label: "Görüntüle",
              onClick: () => router.push(targetPath),
            }
          : undefined,
      });

      if (yenibildirim.type === "organizer_application") {
        queryClient.invalidateQueries({
          queryKey: ["organizer-applications"],
        });
      }

      if (yenibildirim.type === "new_event") {
        queryClient.invalidateQueries({
          queryKey: ["event-applications"],
        });
      }

      queryClient.setQueryData(
        ["notifications", "unread-count"],
        (eskiData: any) => {
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

      queryClient.setQueryData(["notifications", "list"], (eskiData: any) => {
        if (!eskiData || !eskiData.result) {
          return { error: false, result: [yenibildirim] };
        }

        return {
          ...eskiData,
          result: [yenibildirim, ...eskiData.result],
        };
      });
    };

    if (accessToken) {
      /* sockete tokenı ve baglantıyı kur */
      socket.auth = { token: accessToken };
      socket.connect();

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("notification:new", handleNotification);
    } else {
      /* token yoksa hattı kes */
      socket.disconnect();

      /* cıkıs yapınca bayragıda ındır */
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
      socket.off("connect_error", handleConnectError);
      setIsSocketConnected(false);
      socket.disconnect();
    };
  }, [accessToken, queryClient]);

  //* cocukları ekrana bas */
  return <>{children}</>;
}

"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { NotificationDTO } from "@/features/notifications/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const socket = io(URL, { autoConnect: false });

export default function AuthSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  
  /* salterim  useeffect*/
  useEffect(() => {
    if (accessToken) {
      /* sockete tokenı ve baglantıyı kur */
      socket.auth = { token: accessToken };
      socket.connect();
      
      /* backendın gonderdıgı verıyı socket.on la getırdm */
      socket.on("notification:new", (yenibildirim: NotificationDTO) => {
        const targetPath = yenibildirim.linkNotification || "/notifications";
        console.log(targetPath);

        toast("Yeni Bildirim ", {
          description:
            yenibildirim.title || "Sistemden yeni bir mesajınız var.",
          action: yenibildirim.linkNotification
            ? {
                label: "Görüntüle",
                onClick: () => router.push(targetPath),
              }
            : undefined,
        });
        console.log("Yeni bildirim yakalandı!", yenibildirim);

        /* sayac guncellem (Badge) */
        queryClient.setQueryData(
          ["notifications", "unread-count"],
          (eskiData: any) => {
            // Eğer raf boşsa (henüz API çekilmediyse):
            if (!eskiData || !eskiData.data) {
              return { error: false, data: { count: 1 } };
            }

            // Kutunun yapısını koruyarak sadece count değerini 1 artır:
            return {
              ...eskiData,
              data: {
                ...eskiData.data,
                count: eskiData.data.count + 1,
              },
            };
          },
        );

        /* list güncelle (Inbox) */
        queryClient.setQueryData(["notifications", "list"], (eskiData: any) => {
          /*  Eğer raf boşsa (henüz API çekilmediyse) */
          if (!eskiData || !eskiData.result) {
            return { error: false, result: [yenibildirim] };
          }

          /*    Kutunun yapısını koruyarak yeni bildirimi result dizisinin en başına ekle */
          return {
            ...eskiData,
            result: [yenibildirim, ...eskiData.result],
          };
        });

      });
    } else {
      /* token yoksa hattı kes */
      socket.disconnect();
    }

    /* cleanup */
    return () => {
      /* memory sızıntısı sorununa karsın */
      /* bileşen ekrandan gıttı : kapanma, sayfa degısımı gıbı */
      /* frekansı dınlemeyı bırak ve baglantıyı kes dıyorum */
      socket.off("notification:new");
      socket.disconnect();
    };
  }, [accessToken, queryClient]);

  //* cocukları ekrana bas */
  return <>{children}</>;
}

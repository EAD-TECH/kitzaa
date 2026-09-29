"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import type {
  ListNotificationsResponse,
  NotificationDTO,
  UnreadCountResponse,
} from "@/features/notifications/types";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
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
  const setIsSocketConnected = useAuthStore(
    (state) => state.setIsSocketConnected,
  );
  const queryClient = useQueryClient();

  /* salterim  useeffect*/
  useEffect(() => {
    if (accessToken) {
      /* sockete tokenı ve baglantıyı kur */
      socket.auth = { token: accessToken };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket bağlandı, Polling durdurulacak!");
        setIsSocketConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket koptu, Polling (Yedekleme) devreye giriyor!");
        setIsSocketConnected(false);
      });

      // Hata olursa da koptu sayıyoruz
      socket.on("connect_error", () => {
        setIsSocketConnected(false);
      });

      /* backendın gonderdıgı verıyı socket.on la getırdm */
      /* burda socket baglantısı kurulduktan sonra socketın durumunu dınlıyorm ve zustanda yazıyorm */
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
        queryClient.setQueryData<UnreadCountResponse>(
          ["notifications", "unread-count"],
          (eskiData) => {
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
        /* liste sayfalı (useInfiniteQuery): yeni bildirim ilk sayfanın en başına eklenir */
        queryClient.setQueryData<InfiniteData<ListNotificationsResponse>>(
          ["notifications", "list"],
          (eskiData) => {
            /* Raf boşsa dokunma — liste açıldığında API'den güncel hâliyle çekilir */
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
      });
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
      socket.off("notification:new");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      setIsSocketConnected(false);
      socket.disconnect();
    };
  }, [accessToken, queryClient]);

  //* cocukları ekrana bas */
  return <>{children}</>;
}

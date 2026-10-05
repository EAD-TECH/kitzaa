"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import type {
  ListNotificationsResponse,
  NotificationDTO,
  UnreadCountResponse,
} from "@/features/notifications/types";

import { socket } from "@/features/socket/socket";
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

  /* salterim  useeffect*/
  useEffect(() => {
    if (accessToken) {
      /* sockete tokenı ve baglantıyı kur */
      socket.auth = { token: accessToken };
      socket.connect();

      socket.on("connect", () => {
        /* console.log("Socket bağlandı, Polling durdurulacak!"); */
        setIsSocketConnected(true);
        socket.emit("update_path", pathname);
      });

      socket.on("disconnect", () => {
        console.log("Socket koptu, Polling (Yedekleme) devreye giriyor!");
        setIsSocketConnected(false);
      });

      /* kullanıcının admının davetını duyması ıcın */
      socket.on("chat_invite", (payload) => {
        console.log("admın benı cagırdı odaya katılıyorm", payload.roomId);
        /* backende emıt benı odaya al */
        socket.emit("join_chat_room", { roomId: payload.roomId });
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
      socket.off("join_chat_room");
      setIsSocketConnected(false);
      socket.disconnect();
    };
  }, [accessToken, queryClient]);

  const isSocketConnected = useAuthStore((state) => state.isSocketConnected);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("update_path", pathname);
    }
  }, [pathname, isSocketConnected]);

  //* cocukları ekrana bas */
  return <>{children}</>;
}

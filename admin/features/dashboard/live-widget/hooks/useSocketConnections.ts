import { useAuthStore } from "@/features/auth/store/authStore";
import { useEffect } from "react";
import { useLiveWidgetStore } from "../store/useLiveWidgetStore";
import { socket } from "@/providers/auth.socket.providers";

export const useSocketConnection = () => {
  /* tokenı cek  */
  const token = useAuthStore((state) => state.accessToken);
  /* depomdan socket statusunu cektım */
  const setSocketStatus = useLiveWidgetStore((state) => state.setSocketStatus);
  const addActivity = useLiveWidgetStore((state) => state.addActivity);
  const setActivities = useLiveWidgetStore((state) => state.setActivities);
  const setOnlineUsers = useLiveWidgetStore((state) => state.setOnlineUsers);

  /*   console.log(token, "oldumu") */ useEffect(() => {
    if (!token) {
      return;
      /*  console.log("token gelmesı lazım"); */
    }
    /*    console.log(
      "once motorun calısması lazım:sebekeyı dınlemem lazım token okey",
    ); */

    /* baglantı gerceklestı socket.on ıle baglantıyı gerceklestırıyorm */
    socket.on("connect", () => {
      /*  console.log("baglantı oldu zustand depomdakı statusumu guncellıyorum"); */
      setSocketStatus(true);
    });

    socket.on("new_activity", (newActivityData) => {
      /*  console.log("yeni bildirim geldi zustanı yenılıyorm") */
      addActivity(newActivityData);
    });
    socket.on("activity_snapshot", (newactivites) => {
      setActivities(newactivites);
    });

    socket.on("online_users_update", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      setSocketStatus(false);
    });

    console.log("backende baglandımmı", socket);

    /* cleanup mantıgı */
    return () => {
      socket.off("connect");
      socket.off("new_activity");
      socket.off("activity_snapshot");
      socket.off("online_users_update");
      socket.off("disconnect");
      /*  console.log("baglantı durdu:sebeke yanı socket baglantım kesıldı🔴🔴"); */
    };
    /* bos dızı eklıyorm bır kere tetıklen sadece */
  }, [token, addActivity, setActivities, setOnlineUsers, setSocketStatus]);
};

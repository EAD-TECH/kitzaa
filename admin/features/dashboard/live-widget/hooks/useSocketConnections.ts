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

  useEffect(() => {
    if (!token) {
      return;
    }

    const handleConnect = () => {
      setSocketStatus(true);
    };

    const handleNewActivity = (
      newActivityData: Parameters<typeof addActivity>[0],
    ) => {
      addActivity(newActivityData);
    };

    const handleActivitySnapshot = (
      newactivites: Parameters<typeof setActivities>[0],
    ) => {
      setActivities(newactivites);
    };

    const handleOnlineUsersUpdate = (
      users: Parameters<typeof setOnlineUsers>[0],
    ) => {
      setOnlineUsers(users);
    };

    const handleDisconnect = () => {
      setSocketStatus(false);
    };

    socket.on("connect", handleConnect);
    socket.on("new_activity", handleNewActivity);
    socket.on("activity_snapshot", handleActivitySnapshot);
    socket.on("online_users_update", handleOnlineUsersUpdate);
    socket.on("disconnect", handleDisconnect);

    /* cleanup mantıgı */
    return () => {
      socket.off("connect", handleConnect);
      socket.off("new_activity", handleNewActivity);
      socket.off("activity_snapshot", handleActivitySnapshot);
      socket.off("online_users_update", handleOnlineUsersUpdate);
      socket.off("disconnect", handleDisconnect);
    };
    /* bos dızı eklıyorm bır kere tetıklen sadece */
  }, [token, addActivity, setActivities, setOnlineUsers, setSocketStatus]);
};

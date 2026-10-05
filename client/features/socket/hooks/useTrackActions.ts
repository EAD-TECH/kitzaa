"use client";

import { useCallback } from "react";
import { TrackActionsProps } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { AuthUser } from "@/features/auth/types/authTypes";
import { useAuthStore } from "@/features/auth/store/authStore";
import { socket } from "@/features/socket/socket";

export const useTrackActions = () => {
  const isSocketConnected = useAuthStore((state) => state.isSocketConnected);
  const queryClient = useQueryClient();

  const handleTrackActions = useCallback(
    (data: TrackActionsProps) => {
      const user = queryClient.getQueryData<AuthUser>(["currentUser"]);
      /* kullanıcı gırıs yapmamıssa admın ıse socket baglantısıvyoksa return et */

      if (!user || user.role === "admin" || !isSocketConnected) return;

      socket.emit("user_action", {
        type: data.type,
        title: data.title,
        description: data.description,
        relatedId: data.relatedId,
        linkUrl: data.linkUrl,
      });
    },
    [isSocketConnected, queryClient],
  );
  return { handleTrackActions };
};

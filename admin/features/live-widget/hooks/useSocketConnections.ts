import { useAuthStore } from "@/features/auth/store/authStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocketConnection = () => {
  /* tokenı cek  */
  const token = useAuthStore((state) => state.accessToken);
  console.log(token, "oldumu");
  useEffect(() => {
    if (!token) {
      return
     /*  console.log("token gelmesı lazım"); */
    }
    console.log(
      "once motorun calısması lazım:sebekeyı dınlemem lazım token okey🟢",
    );

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: {
        token: token,  /* backendın bekledıgı tokenı gondermem lazım kı ıcerı alsın benı */
      },
    });
    console.log("backende baglandımmı", socket);

    /* cleanup mantıgı */
    return () => {
      socket.disconnect()
      console.log("baglantı durdu:sebeke yanı socket baglantım kesıldı🔴🔴");
    };
    /* bos dızı eklıyorm bır kere tetıklen sadece */
  }, [token]);
};

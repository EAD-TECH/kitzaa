"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useEffect } from "react";
import { io } from "socket.io-client";
// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:8000";

export const socket = io(URL, { autoConnect: false });

export default function AuthSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  console.log(accessToken);

  /* salterim  useeffect*/

  useEffect(() => {
    if (accessToken) {
      /* sockete tokenı ve baglantıyı kur */

      socket.auth = { token: accessToken };
      socket.connect();
    } else {
      /* token yoksa hattı kes */
      socket.disconnect();
    }

    /* cleanup */
    return () => {
      /* bileşen ekrandan gıttı kapanma sayfa degısımı gıbı */

      /* memory sızıntısı sorununa karsın */

      socket.disconnect();
    };
  }, [accessToken]);


  //* cocukları ekrana bas */
  return <>{children}</>;
}

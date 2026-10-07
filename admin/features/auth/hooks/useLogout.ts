import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../api";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";
import { redirectExternal } from "../utils/navigation";

const CLIENT_URL =
  process.env.NEXT_PUBLIC_CLIENT_URL ?? "http://localhost:3000";

export function useLogout() {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearAdminSession = () => {
    setAccessToken(null);
    queryClient.setQueryData(["currentUser"], null);
  };

  const goToLogin = () => {
    redirectExternal(`${CLIENT_URL}/login`);
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logoutApi();
      clearAdminSession();
      goToLogin();
    } catch (err) {
      clearAdminSession();
      goToLogin();

      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Sitzung abgelaufen. Du wurdest abgemeldet.");
        } else {
          setError("Abmeldung fehlgeschlagen. Bitte versuche es erneut.");
        }
      } else {
        setError("Der Server konnte nicht erreicht werden. Bitte versuche es erneut.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../AuthApi";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";
import { useEventsStore } from "@/features/events/store/EventStore";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSavedEventIds = useEventsStore((state) => state.setSavedEventIds);

  const clearClientSession = () => {
    setAccessToken(null);
    queryClient.setQueryData(["currentUser"], null);
    setSavedEventIds([])
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logoutApi();
      clearClientSession();
      router.push("/");
    } catch (err) {
      clearClientSession();
      router.push("/");

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

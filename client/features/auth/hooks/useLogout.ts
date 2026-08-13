import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutApi } from "../api";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSession = useAuthStore((state) => state.clearSession);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logoutApi();
      clearSession();
      router.push("/");
    } catch (err) {
      // Kullanıcı çıkış istedi. Backend düşse bile yerelde oturumu kapat.
      clearSession();
      router.push("/");

      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Session expired. You were signed out.");
        } else {
          setError("Logout failed. Please try again.");
        }
      } else {
        setError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}

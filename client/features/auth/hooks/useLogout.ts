import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../AuthApi";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearClientSession = () => {
    setAccessToken(null);
    queryClient.setQueryData(["currentUser"], null);
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

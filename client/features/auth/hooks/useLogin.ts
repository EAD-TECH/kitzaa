import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginApi } from "../AuthApi";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";
import type { LoginFormValues } from "../validations/login.schema";
import { useEventsStore } from "@/features/events/store/EventStore";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const setSavedEventIds = useEventsStore((state) => state.setSavedEventIds)

  return useMutation({
    mutationFn: (values: LoginFormValues) => loginApi(values),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["currentUser"], data.user);
      setSavedEventIds(data.user.savedEvents)

      if (data.user.role === "admin") {
        window.location.assign(
          process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001",
        );
        return;
      }

      router.push("/");
    },
  });
}

// Returns a translation key under "Login.errors" so the message follows the active locale.
export function mapLoginError(error: unknown): "invalidCredentials" | "failed" | "network" {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 404) {
      return "invalidCredentials";
    }
    return "failed";
  }

  return "network";
}

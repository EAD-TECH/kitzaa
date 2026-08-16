import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginApi } from "../api";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";
import type { LoginFormValues } from "../validations/login.schema";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (values: LoginFormValues) => loginApi(values),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["currentUser"], data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/");
    },
  });
}

export function mapLoginError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 404) {
      return "Invalid email/username or password.";
    }
    return "Login failed. Please try again.";
  }

  return "Unable to reach the server. Please try again.";
}

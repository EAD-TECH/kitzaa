import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { login as loginApi } from "../api";
import { useAuthStore } from "../store/authStore";
import type { LoginFormValues } from "../validations/loginSchema";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useAuthStore((state) => state.setSession);

  const login = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginApi(values);
      setSession({ accessToken: data.accessToken, user: data.user });
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError("Unable to reach the server. Please try again.");
        } else if (err.response.status === 401 || err.response.status === 404) {
          setError("Invalid email/username or password.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

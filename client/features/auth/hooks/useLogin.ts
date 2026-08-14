import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi } from "../api";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/lib/api/client";
import type { LoginFormValues } from "../validations/login.schema";

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
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 404) {
          setError("Invalid email/username or password.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}


// import { useMutation } from "@tanstack/react-query"

// export function useLogin() {
//   const router = useRouter()
//   const setSession = useAuthStore((state) => state.setSession)

//   const mutation = useMutation({
//     mutationFn: loginApi,
//     onSuccess: (data) => {
//       setSession({ accessToken: data.accessToken, user: data.user })
//       router.push("/")
//     },
//   })

//   return {
//     login: mutation.mutate,
//     isLoading: mutation.isPending,
//     error: mutation.error ? mapLoginError(mutation.error) : null,
//   }
// }

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { aiEventSearch } from "../api/aiEventSearchApi";

export const useAiEventSearch = () => {
  return useMutation({
    mutationFn: aiEventSearch,
    onError: (err) => {
      const message =
        err instanceof ApiError && err.status === 429
          ? "Du hast zu viele KI-Suchen gestartet. Bitte versuche es später erneut."
          : err instanceof ApiError && err.status !== 400
            ? err.message
            : "Die Suche konnte nicht verarbeitet werden. Bitte formuliere deine Anfrage anders.";
      toast.error(message);
    },
  });
};

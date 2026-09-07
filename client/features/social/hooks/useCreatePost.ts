import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSocialPost } from "../api/postApi";
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import type { CreatePostInput } from '../validations/post.schema';

const POST_CREATE_ERROR_MESSAGES: Record<string, string> = {
}

export const useCreatePost = () => {

  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData: CreatePostInput) => createSocialPost(postData),
    onError: (err) => {
      const message = err instanceof ApiError
        ? (POST_CREATE_ERROR_MESSAGES[err.message] ?? "Beitrag konnte nicht erstellt werden. Bitte versuche es erneut.")
        : "Beitrag konnte nicht erstellt werden. Bitte versuche es erneut."
      toast.error(message)
    },
    onSuccess: () => {
      toast.success("Beitrag erfolgreich erstellt.");
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    }
  })
}


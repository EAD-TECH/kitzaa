import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeSocialPost } from "../api/postApi";

export const useTogglePostLike = () => {
  //api istegini yönetir ve optimistic update yapmamıza olanak sağlar. Tanstack'in useMutation hook'u ile api istegini yönetiyoruz.

  const queryClient = useQueryClient(); //Tanstack'in queryClient'ını kullanarak cache'i güncellemek için kullanıyoruz.

  return useMutation({
    mutationFn: (id: string) => likeSocialPost(id),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["social-posts"] });

      //“Cache’i değiştirmeden önce mevcut social-posts cache’lerinin bir kopyasını/snapshot’ını sakla.
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["social-posts"],
      });

      //Asil cache degisikligimiz burada.Tanstack burada her eslesen cachein mevcut datasini oldData olarak verioyr. Bizde bu oldData'yi kullanarak cache'i degistiriyoruz. Burada postId ile eşleşen postu bulup isLikedByMe ve likesCount değerlerini güncelliyoruz.
      queryClient.setQueriesData({ queryKey: ["social-posts"] }, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (post._id !== postId) {
                return post;
              }

              const isPostLiked = post.isLikedByMe;

              return {
                ...post,
                isLikedByMe: !isPostLiked,
                likesCount: isPostLiked ? post.likesCount - 1 : post.likesCount + 1,
              };
            }),
          })),
        };
      });


      //Eger api istegi basarisiz olursa cache'i eski haline getirmek icin previousQueries'i return ediyoruz. onError'da bu previousQueries'i kullanarak cache'i eski haline getirecegiz.
      return { previousQueries };
    },

    //context parametresi onMutate'da return edilen previousQueries'i alıyor. onError'da bu context'i kullanarak cache'i eski haline getireceğiz.
    onError: (_error, _postId, context) => {
      context?.previousQueries.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },

    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: ["social-posts"] }, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => (post._id === data.post._id ? data.post : post)),
          })),
        };
      });
    },
  });
};

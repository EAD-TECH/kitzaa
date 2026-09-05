import { useInfiniteQuery } from "@tanstack/react-query";
import { listSocialPosts } from "../api/postApi";
import type { UsePostsParams } from "../types/post.types";

export const usePosts = ({ city, eventId, sort, search }: UsePostsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ["social-posts", { city, eventId, sort, search }],

    queryFn: ({ pageParam }) => {
      return listSocialPosts({
        page: pageParam,
        limit: 5,
        city,
        eventId,
        sort,
        search,
      });
    },
    //queryFn ne döndürdüyse TanStack onu cache'e koyuyor.Burdaki yani BE'den dönen verinin tamami ilk anda lastPage oluyor

    initialPageParam: 1, //pageParam'in ilk kaynagi initialPageParam'dir.Sonra kullanci asagiya scroll eder ve fetchNextPage() calisti diyelim bu sefer tanstack query asagidaki func'ina bakiyor.Burdan next page degeri alinip pageParama ataniyor

    getNextPageParam: (lastPage) => {
      const next = lastPage.details.pages && lastPage.details.pages.next;

      return next === false ? undefined : next;
    },
  });
};

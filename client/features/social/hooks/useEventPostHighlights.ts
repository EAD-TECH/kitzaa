import { useQuery } from "@tanstack/react-query";

import { listSocialPosts } from "../api/postApi";

export const useEventPostHighlights = () => {
  return useQuery({
    queryKey: ["social-event-post-highlights"],
    queryFn: () =>
      listSocialPosts({
        page: 1,
        limit: 100,
        sort: { createdAt: -1 },
      }),
  });
};

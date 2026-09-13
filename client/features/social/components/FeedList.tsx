"use client";

import { useTranslations } from "next-intl";

import PostCard from "./PostCard";
import type { PostDTO } from "../types/post.types";

interface FeedListProps {
  posts: PostDTO[];
  emptyMessage?: string;
}

function FeedList({ posts, emptyMessage }: FeedListProps) {
  const t = useTranslations("Social");
  const message = emptyMessage ?? t("emptyPosts");
  if (posts.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default FeedList;

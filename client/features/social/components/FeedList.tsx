import PostCard from "./PostCard";
import type { PostDTO } from "../types/post.types";

interface FeedListProps {
  posts: PostDTO[];
  emptyMessage?: string;
}

function FeedList({ posts, emptyMessage = "Noch keine Beiträge." }: FeedListProps) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <p className="text-center text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-8">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default FeedList;

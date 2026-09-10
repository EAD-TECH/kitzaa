import PostDetailView from "@/features/social/components/PostDetailView";

interface PostDetailPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 tablet:px-8 tablet:py-10">
      <div className="overflow-hidden rounded-3xl border bg-background shadow-sm">
        <PostDetailView postId={postId} />
      </div>
    </div>
  );
}
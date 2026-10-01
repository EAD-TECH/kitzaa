import { PostDetailDialog } from "@/features/social/components/PostDetailDialog";

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function InterceptedPostPage({ params }: Props) {
  const { postId } = await params;

  return <PostDetailDialog postId={postId} />;
}

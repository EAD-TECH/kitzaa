"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import PostDetailView from "./PostDetailView";

export function PostDetailDialog({ postId }: { postId: string }) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back();
      }}
    >
      <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 tablet:max-w-3xl desktop:max-w-4xl">
        <PostDetailView postId={postId} />
      </DialogContent>
    </Dialog>
  );
}

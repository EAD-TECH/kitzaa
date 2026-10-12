"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreatePostForm from "./CreatePostForm";
import type { PostDTO } from "../types/post.types";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: PostDTO;
}

export function CreatePostDialog({ open, onOpenChange, post }: CreatePostDialogProps) {
  const t = useTranslations("Social");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 tablet:max-w-3xl desktop:max-w-4xl">
        <DialogHeader className="border-b p-6">
          {post ? <DialogTitle>{t("editPost")}</DialogTitle> : <DialogTitle>{t("newPost")}</DialogTitle>}
        </DialogHeader>
        {open ? (
          <CreatePostForm
            key={post?._id ?? "create"}
            onCreated={() => onOpenChange(false)}
            post={post}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

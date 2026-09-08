"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreatePostForm from "./CreatePostForm";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 tablet:max-w-3xl desktop:max-w-4xl">
        <DialogHeader className="border-b p-6">
          <DialogTitle>Neuen Beitrag erstellen</DialogTitle>
        </DialogHeader>
        <CreatePostForm onCreated={() => onOpenChange(false)}/>
      </DialogContent>
    </Dialog>
  );
}

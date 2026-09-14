"use client";

import Image from "next/image";
import { CalendarDays, Heart, MapPin, MessageCircle, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PostDTO } from "../types/post.types";
import { useDeletePost } from "../hooks/socialHooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function formatPostDate(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function authorInitials(post: PostDTO) {
  const initials =
    `${post.author.firstName?.[0] ?? ""}${post.author.lastName?.[0] ?? ""}`.trim() ||
    post.author.username?.slice(0, 2) ||
    "P";
  return initials.toUpperCase();
}

function isNewPost(createdAt: string) {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < THREE_DAYS_MS;
}

interface MyPostCardProps {
  post: PostDTO;
}

export function MyPostCard({ post }: MyPostCardProps) {
  const dateLabel = formatPostDate(post.createdAt);
  const placeLabel = [...new Set([post.placeName, post.city].filter(Boolean))].join(", ");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: deletePost, isPending } = useDeletePost();

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CardContent className="flex items-center gap-4 p-3">
        <div className="relative aspect-square size-16 shrink-0 overflow-hidden rounded-xl">
          {post.imageUrl ? (
            <Image src={post.imageUrl} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-secondary to-accent">
              <span className="text-sm font-semibold text-secondary-foreground/70">
                {authorInitials(post)}
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{post.text}</h3>
            {post.event ? (
              <Badge variant="secondary" className="max-w-40 shrink-0 truncate">
                {post.event.title}
              </Badge>
            ) : null}
            {isNewPost(post.createdAt) ? (
              <Badge variant="outline" className="shrink-0">
                Neu
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {dateLabel ? (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3 shrink-0" />
                {dateLabel}
              </span>
            ) : null}
            {placeLabel ? (
              <span className="flex min-w-0 items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{placeLabel}</span>
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Heart className="size-3 shrink-0" />
              {post.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3 shrink-0" />
              {post.commentsCount}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" size="sm">
            <Pencil className="size-3.5" />
            Bearbeiten
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            disabled={isPending}
          >
            <Trash2 className="size-3.5" />
            Löschen
          </Button>

          <AlertDialog
            open={deleteOpen}
            onOpenChange={(next) => {
              if (!isPending) setDeleteOpen(next)
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Beitrag löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dieser Beitrag wird entfernt. Das kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isPending}
                  onClick={() =>
                    deletePost(post._id, {
                      onSuccess: () => setDeleteOpen(false),
                    })
                  }
                >
                  {isPending ? "Wird gelöscht…" : "Löschen"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

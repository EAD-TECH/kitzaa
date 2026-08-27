"use client";

import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Heart, MessageCircle, MoreHorizontal, Share2, Trees } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PostDTO } from "../types/post.types";

function PostCard({ post }: { post: PostDTO }) {
  const locale = useLocale();
  const name = [post.author.firstName, post.author.lastName].filter(Boolean).join(" ");
  const createdAt = new Date(post.createdAt);
  const relativeDate = Number.isNaN(createdAt.getTime())
    ? null
    : formatDistanceToNow(createdAt, {
        addSuffix: true,
        locale: locale.startsWith("de") ? de : enUS,
      });

  return (
    <Card className="mx-auto w-full max-w-xl gap-0 overflow-hidden py-0">
      <CardHeader className="bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            {post.author.avatarUrl ? (
              <AvatarImage src={post.author.avatarUrl} alt={name} />
            ) : null}
            <AvatarFallback>
              {post.author.firstName?.[0]}
              {post.author.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle>
              {name}
            </CardTitle>
            {relativeDate ? (
              <CardDescription>
                <time
                  dateTime={post.createdAt}
                  title={createdAt.toLocaleString(locale)}
                  suppressHydrationWarning
                >
                  {relativeDate}
                </time>
              </CardDescription>
            ) : null}
          </div>
        </div>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="Mehr">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>

      <div className="relative aspect-video w-full overflow-hidden">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.text}
            fill
            sizes="(max-width: 640px) 100vw, 576px"
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}

        {post.event ? (
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 h-auto gap-1 bg-secondary/90 px-2.5 py-1 text-secondary-foreground shadow-sm"
          >
            <Trees />
            {post.event.title}
          </Badge>
        ) : null}
      </div>

      <CardFooter className="justify-between px-4 py-3">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-sm">
            <Heart className={cn("size-5", post.isLikedByMe && "fill-primary text-primary")} />
            {post.likesCount}
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <MessageCircle className="size-5" />
            {post.commentsCount}
          </span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Teilen">
          <Share2 />
        </Button>
      </CardFooter>

      <CardContent className="px-4 pt-0 pb-4">
        <p className="text-sm leading-relaxed">
          <span className="font-bold">
            {name}{" "}
          </span>
          {post.text}
        </p>
      </CardContent>
    </Card>
  );
}

export default PostCard;

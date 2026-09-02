"use client";

import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Heart, MessageCircle, MoreHorizontal, Share2, Trees } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
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
import { useTogglePostLike } from "../hooks/useTooglePostLike";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

function PostCard({ post }: { post: PostDTO }) {
  const locale = useLocale();
  const t = useTranslations("Social");
  const name = [post.author.firstName, post.author.lastName].filter(Boolean).join(" ");
  const createdAt = new Date(post.createdAt);
  const relativeDate = Number.isNaN(createdAt.getTime())
    ? null
    : formatDistanceToNow(createdAt, {
        addSuffix: true,
        locale: locale.startsWith("de") ? de : enUS,
      });

  const { mutate, isPending } = useTogglePostLike();

  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  const handleLikeClick = () => {
    if (!currentUser) {
      toast(t("likeLoginPrompt"), {
        action: {
          label: t("signIn"),
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    mutate(post._id);
  };

  return (
    <Card className="mx-auto w-full max-w-xl gap-0 overflow-hidden py-0">
      <CardHeader className="bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            {post.author.avatarUrl ? <AvatarImage src={post.author.avatarUrl} alt={name} /> : null}
            <AvatarFallback>
              {post.author.firstName?.[0]}
              {post.author.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle>{name}</CardTitle>
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
          <Button variant="ghost" size="icon" aria-label={t("more")}>
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
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1.5 px-0 text-sm hover:bg-transparent"
            disabled={isPending}
            onClick={handleLikeClick}
            aria-label={post.isLikedByMe ? t("unlike") : t("like")}
          >
            <Heart className={cn("size-5", post.isLikedByMe && "fill-primary text-primary")} />
            {post.likesCount}
          </Button>

          <span className="flex items-center gap-1.5 text-sm">
            <MessageCircle className="size-5" />
            {post.commentsCount}
          </span>
        </div>

        <Button variant="ghost" size="icon" aria-label={t("share")}>
          <Share2 />
        </Button>
      </CardFooter>

      <CardContent className="px-4 pt-0 pb-4">
        <p className="text-sm leading-relaxed">
          <span className="font-bold">{name} </span>
          {post.text}
        </p>
      </CardContent>
    </Card>
  );
}

export default PostCard;

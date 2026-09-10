"use client";

import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import Image from "next/image";
import { Heart, ImageOff, MapPin, MessageCircle, MoreHorizontal, Send, Trees } from "lucide-react";
import { useLocale } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { PostDTO } from "../types/post.types";
import { useCreatePostComment, usePostComments } from "../hooks/socialHooks";
import { useState } from "react";

interface PostDetailContentProps {
  post: PostDTO;
}

interface SelectedComment {
  commentId: string | null;
  authorName: string | null;
}

export default function PostDetailContent({ post }: PostDetailContentProps) {
  const locale = useLocale();
  const authorName =
    [post.author.firstName, post.author.lastName].filter(Boolean).join(" ") ||
    post.author.username ||
    "Unbekannter Nutzer";
  const authorInitials =
    `${post.author.firstName?.[0] ?? ""}${post.author.lastName?.[0] ?? ""}` ||
    post.author.username?.slice(0, 2).toUpperCase() ||
    "?";

  const createComment = useCreatePostComment();
  const { data, isLoading, isError } = usePostComments(post._id);

  const comments = data?.comments ?? [];

  const [commentText, setCommentText] = useState("");
  const [selectedComment, setSelectedComment] = useState<SelectedComment | null>(null);
  console.log("Selected comment ID:", selectedComment);

  const onCommentSubmit = () => {
    console.log("Submitting comment:", commentText);
    createComment.mutate(
      {
        postId: post._id,
        text: commentText.trim(),
        parentCommentId: selectedComment?.commentId ?? null,
      },
      {
        onSuccess: () => {
          console.log("Yorum başarılı, input temizleniyor");
          setCommentText("");
          setSelectedComment(null);
        },
      },
    );
  };

  return (
    <div className="grid min-h-0 overflow-hidden desktop:h-[78dvh] desktop:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <section className="relative min-h-80 overflow-hidden bg-muted desktop:min-h-0">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.text}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full min-h-80 flex-col items-center justify-center gap-3 text-muted-foreground">
            <ImageOff className="size-10" />
            <p className="text-sm">Kein Bild verfügbar</p>
          </div>
        )}

        {post.event ? (
          <Badge className="absolute top-4 left-4 gap-1.5 bg-background/85 text-foreground backdrop-blur-sm">
            <Trees className="size-3.5" />
            {post.event.title}
          </Badge>
        ) : null}
      </section>

      <section className="flex min-h-0 flex-col bg-background">
        <header className="flex items-center gap-3 border-b px-5 py-4 pr-14">
          <Avatar>
            {post.author.avatarUrl ? <AvatarImage src={post.author.avatarUrl} alt={authorName} /> : null}
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{authorName}</p>
            {post.city || post.placeName ? (
              <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {[post.placeName, post.city].filter(Boolean).join(", ")}
              </p>
            ) : null}
          </div>

          <Button type="button" variant="ghost" size="icon" aria-label="Weitere Optionen">
            <MoreHorizontal />
          </Button>
        </header>

        <ScrollArea className="min-h-60 flex-1">
          <div className="space-y-5 p-5">
            <div className="flex items-start gap-3">
              <Avatar className="size-8">
                {post.author.avatarUrl ? <AvatarImage src={post.author.avatarUrl} alt={authorName} /> : null}
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>

              <p className="min-w-0 text-sm leading-relaxed">
                <span className="font-medium">{authorName} </span>
                {post.text}
              </p>
            </div>

            {post.event ? (
              <Card size="sm" className="bg-muted/30">
                <CardContent className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Trees className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Verknüpftes Event</p>
                    <p className="truncate font-medium">{post.event.title}</p>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Separator />

            <div className="flex items-center gap-4">
              <Button type="button" variant="ghost" size="sm" className="h-auto gap-2 px-0">
                <Heart className="size-5" />
                <span>{post.likesCount} Gefällt mir</span>
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">
                Kommentare
                <span className="ml-1 text-sm font-normal text-muted-foreground">({post.commentsCount})</span>
              </h2>
              <MessageCircle className="size-5 text-muted-foreground" />
            </div>

            {isLoading ? (
              <div className="flex min-h-36 items-center justify-center">
                <p className="text-sm text-muted-foreground">Kommentare werden geladen...</p>
              </div>
            ) : isError ? (
              <div className="flex min-h-36 items-center justify-center text-center">
                <p className="text-sm text-destructive">Kommentare konnten nicht geladen werden.</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex min-h-36 flex-col items-center justify-center text-center">
                <MessageCircle className="mb-3 size-8 text-muted-foreground/60" />
                <p className="text-sm font-medium">Noch keine Kommentare</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sei die erste Person, die diesen Beitrag kommentiert.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((comment) => {
                  if (comment.parentCommentId !== null) return null;

                  const replies = comments.filter((reply) => reply.parentCommentId === comment._id);
                  const commentAuthorName = comment.author.username || "Unbekannter Nutzer";
                  const commentAuthorInitials =
                    `${comment.author.firstName?.[0] ?? ""}${comment.author.lastName?.[0] ?? ""}` ||
                    comment.author.username?.slice(0, 2).toUpperCase() ||
                    "?";
                  const createdAt = new Date(comment.createdAt);
                  const relativeDate = Number.isNaN(createdAt.getTime())
                    ? null
                    : formatDistanceToNow(createdAt, {
                        addSuffix: true,
                        locale: locale.startsWith("de") ? de : enUS,
                      });

                  return (
                    <div key={comment._id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-8">
                          {comment.author.avatarUrl ? (
                            <AvatarImage src={comment.author.avatarUrl} alt={commentAuthorName} />
                          ) : null}
                          <AvatarFallback>{commentAuthorInitials}</AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-relaxed">
                            <span className="font-medium">{commentAuthorName} </span>
                            {comment.text}
                          </p>

                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            {relativeDate ? (
                              <time dateTime={comment.createdAt} title={createdAt.toLocaleString(locale)}>
                                {relativeDate}
                              </time>
                            ) : null}
                            <Button type="button" variant="ghost" size="xs" className="h-auto px-0">
                              Gefällt mir
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              className="h-auto px-0"
                              onClick={() => {
                                setSelectedComment({ commentId: comment._id, authorName: commentAuthorName });
                                setCommentText(`@${commentAuthorName} `);
                              }}
                            >
                              Antworten
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Kommentar von ${commentAuthorName} liken`}
                        >
                          <Heart className="size-3.5" />
                        </Button>
                      </div>

                      {replies.length > 0 ? (
                        <details className="group ml-11">
                          <summary className="flex cursor-pointer list-none items-center gap-3 text-xs font-medium text-muted-foreground">
                            <span className="h-px w-6 bg-border" />
                            <span className="group-open:hidden">Antworten anzeigen ({replies.length})</span>
                            <span className="hidden group-open:inline">Antworten ausblenden</span>
                          </summary>

                          <div className="mt-4 space-y-4">
                            {replies.map((reply) => {
                              const replyAuthorName =
                                [reply.author.firstName, reply.author.lastName].filter(Boolean).join(" ") ||
                                reply.author.username ||
                                "Unbekannter Nutzer";
                              const replyAuthorInitials =
                                `${reply.author.firstName?.[0] ?? ""}${reply.author.lastName?.[0] ?? ""}` ||
                                reply.author.username?.slice(0, 2).toUpperCase() ||
                                "?";
                              const replyCreatedAt = new Date(reply.createdAt);
                              const replyRelativeDate = Number.isNaN(replyCreatedAt.getTime())
                                ? null
                                : formatDistanceToNow(replyCreatedAt, {
                                    addSuffix: true,
                                    locale: locale.startsWith("de") ? de : enUS,
                                  });

                              return (
                                <div key={reply._id} className="flex items-start gap-3">
                                  <Avatar className="size-7">
                                    {reply.author.avatarUrl ? (
                                      <AvatarImage src={reply.author.avatarUrl} alt={replyAuthorName} />
                                    ) : null}
                                    <AvatarFallback>{replyAuthorInitials}</AvatarFallback>
                                  </Avatar>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm leading-relaxed">
                                      <span className="font-medium">{replyAuthorName} </span>
                                      {reply.text}
                                    </p>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                      {replyRelativeDate ? (
                                        <time
                                          dateTime={reply.createdAt}
                                          title={replyCreatedAt.toLocaleString(locale)}
                                        >
                                          {replyRelativeDate}
                                        </time>
                                      ) : null}
                                      <Button type="button" variant="ghost" size="xs" className="h-auto px-0">
                                        Gefällt mir
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="xs"
                                        className="h-auto px-0"
                                        onClick={() => {
                                          setSelectedComment({
                                            commentId: comment._id,
                                            authorName: commentAuthorName,
                                          });
                                          setCommentText(`@${commentAuthorName} `);
                                        }}
                                      >
                                        Antworten
                                      </Button>
                                    </div>
                                  </div>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    aria-label={`Antwort von ${replyAuthorName} liken`}
                                  >
                                    <Heart className="size-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t">
          <div className="flex items-center gap-3 p-4">
            <Avatar className="size-8">
              <AvatarFallback>DU</AvatarFallback>
            </Avatar>
            <Input
              aria-label="Kommentar schreiben"
              placeholder="Kommentar schreiben..."
              className="rounded-full"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="button"
              size="icon"
              className="shrink-0 rounded-full"
              aria-label="Senden"
              onClick={onCommentSubmit}
            >
              <Send />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

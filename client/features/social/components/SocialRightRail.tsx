"use client";

import { Heart, MessageSquare, PartyPopper } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { useEventPostHighlights } from "../hooks/useEventPostHighlights";

interface EventPostHighlight {
  id: string;
  title: string;
  image: string | null;
  postCount: number;
  likesCount: number;
  featuredPostLikes: number;
}

interface SocialRightRailProps {
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
}

function SocialRightRail({ selectedEventId, onSelectEvent }: SocialRightRailProps) {
  const t = useTranslations("Social");
  const { data, isLoading } = useEventPostHighlights();

  const events = useMemo<EventPostHighlight[]>(() => {
    const groupedEvents = new Map<string, EventPostHighlight>();

    for (const post of data?.posts ?? []) {
      if (!post.event) continue;

      const existing = groupedEvents.get(post.event._id);

      if (existing) {
        existing.postCount += 1;
        existing.likesCount += post.likesCount;

        if (
          post.imageUrl &&
          (!existing.image || post.likesCount > existing.featuredPostLikes)
        ) {
          existing.image = post.imageUrl;
          existing.featuredPostLikes = post.likesCount;
        }

        continue;
      }

      groupedEvents.set(post.event._id, {
        id: post.event._id,
        title: post.event.title,
        image: post.imageUrl,
        postCount: 1,
        likesCount: post.likesCount,
        featuredPostLikes: post.imageUrl ? post.likesCount : -1,
      });
    }

    return [...groupedEvents.values()]
      .sort(
        (first, second) =>
          second.likesCount - first.likesCount ||
          second.postCount - first.postCount ||
          first.title.localeCompare(second.title),
      )
      .slice(0, 5);
  }, [data?.posts]);

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="font-heading text-lg font-semibold">{t("eventsWithPosts")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("eventsWithPostsSubtitle")}</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loadingPosts")}</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("emptyEventPosts")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((event) => {
            const selected = selectedEventId === event.id;

            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onSelectEvent(selected ? "" : event.id)}
                  className={cn(
                    "flex w-full gap-3 rounded-xl p-2 text-left transition-colors",
                    selected ? "bg-accent" : "hover:bg-muted/70",
                  )}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-secondary">
                        <PartyPopper className="size-5 text-secondary-foreground/50" />
                      </div>
                    )}
                  </div>

                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-medium leading-5">{event.title}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="size-3 shrink-0" />
                      {t("postCount", { count: event.postCount })}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="size-3 shrink-0" />
                      {t("likeCount", { count: event.likesCount })}
                    </span>
                    {selected ? (
                      <span className="mt-1 inline-flex text-[11px] font-medium text-primary">
                        {t("inFeed")}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default SocialRightRail;

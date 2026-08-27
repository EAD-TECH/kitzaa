"use client";
import FeedList from "../../../../features/social/components/FeedList";
import { usePosts } from "../../../../features/social/hooks/usePosts";
import type { PostDTO } from "../../../../features/social/types/post.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import SocialFilter from "@/features/social/components/SocialFilter";
import SocialLeftRail from "@/features/social/components/SocialLeftRail";
import SocialRightRail from "@/features/social/components/SocialRightRail";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

function SocialPage() {
  const currentUser = useCurrentUser();
  const currentUserCity = currentUser?.data?.location?.city;

  const [city, setCity] = useState(currentUserCity || "");
  const [eventId, setEventId] = useState("");
  const [sort, setSort] = useState<{ createdAt?: 1 | -1 }>({ createdAt: -1 });
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = usePosts({ city, eventId, sort, search });

  const posts = useMemo<PostDTO[]>(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data],
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const cityInitializedRef = useRef(false);

  useEffect(() => {
    if (!cityInitializedRef.current && currentUserCity) {
      setCity(currentUserCity);
      cityInitializedRef.current = true;
    }
  }, [currentUserCity]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle />
          <div className="space-y-4">
            <div>
              <AlertTitle>Beiträge konnten nicht geladen werden</AlertTitle>
              <AlertDescription>Bitte versuche es in wenigen Augenblicken erneut.</AlertDescription>
            </div>

            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw />
              Erneut versuchen
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-290 grid-cols-1 gap-6 px-4 py-6 desktop:grid-cols-[16.25rem_minmax(0,36rem)_16.25rem] desktop:items-start desktop:gap-8 desktop:px-6">
      <aside className="sticky top-20 hidden desktop:block">
        <SocialLeftRail />
      </aside>

      <div className="min-w-0">
        <SocialFilter
          city={city}
          setCity={setCity}
          eventId={eventId}
          setEventId={setEventId}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <FeedList
            posts={posts}
            emptyMessage={
              eventId ? "Zu diesem Event gibt es noch keine Fotos." : "Noch keine Beiträge."
            }
          />
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div ref={loadMoreRef} />
      </div>

      <aside className="sticky top-20 hidden desktop:block">
        <SocialRightRail
          selectedEventId={eventId}
          onSelectEvent={(selectedEventId) => {
            setEventId(selectedEventId);

            if (selectedEventId) {
              setCity("");
            }
          }}
        />
      </aside>
    </div>
  );
}

export default SocialPage;

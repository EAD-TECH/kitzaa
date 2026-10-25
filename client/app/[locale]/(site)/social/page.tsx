"use client";
import FeedList from "../../../../features/social/components/FeedList";
import { usePosts } from "@/features/social/hooks/socialHooks";
import type { PostDTO } from "../../../../features/social/types/post.types";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SocialFeedHeader from "@/features/social/components/SocialFeedHeader";
import SocialFilter, { SocialFilterTrigger } from "@/features/social/components/SocialFilter";
import SocialLeftRail from "@/features/social/components/SocialLeftRail";
import SocialRightRail from "@/features/social/components/SocialRightRail";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CreatePostDialog } from "@/features/social/components/CreatePostDialog";

const FEED_CONTINUE_MARGIN_PX = 300;

function SocialPage() {
  const t = useTranslations("Social");
  const router = useRouter();
  const isAuthReady = useAuthStore((state) => state.isReady);
  const currentUser = useCurrentUser();
  const currentUserCity = currentUser?.data?.location?.city;
  const [isLoginWallOpen, setIsLoginWallOpen] = useState(false);
  const [feedLocked, setFeedLocked] = useState(false);

  const [city, setCity] = useState(currentUserCity || "");
  const [eventId, setEventId] = useState("");
  const [sort, setSort] = useState<{ createdAt?: 1 | -1 }>({ createdAt: -1 });
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const mobileFilterPanelId = useId();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = usePosts({
    city,
    eventId,
    sort,
    search,
  });

  const posts = useMemo<PostDTO[]>(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

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

    const openLoginWall = () => {
      if (currentUser.data || !isAuthReady || window.scrollY <= 0) return;

      setFeedLocked(true);
      setIsLoginWallOpen(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;

        if (currentUser.data) {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
          return;
        }

        openLoginWall();
      },
      {
        rootMargin: `${FEED_CONTINUE_MARGIN_PX}px`,
      },
    );

    observer.observe(element);

    const onScroll = () => {
      if (currentUser.data) return;

      const reachedContinuePoint =
        element.getBoundingClientRect().top <= window.innerHeight + FEED_CONTINUE_MARGIN_PX;
      if (reachedContinuePoint) openLoginWall();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [currentUser.data, fetchNextPage, hasNextPage, isAuthReady, isFetchingNextPage]);

  useEffect(() => {
    if (!feedLocked || currentUser.data) return;

    const limit = window.scrollY;

    const clampScroll = () => {
      if (window.scrollY <= limit) return;
      window.scrollTo(0, limit);
      setIsLoginWallOpen(true);
    };

    window.addEventListener("scroll", clampScroll, { passive: true });
    return () => window.removeEventListener("scroll", clampScroll);
  }, [currentUser.data, feedLocked]);

  if (isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle />
          <div className="space-y-4">
            <div>
              <AlertTitle>{t("errorTitle")}</AlertTitle>
              <AlertDescription>{t("errorDescription")}</AlertDescription>
            </div>

            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw />
              {t("retry")}
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 grid w-full grid-cols-1 gap-6 px-6 tablet:px-20 desktop:grid-cols-[360px_minmax(0,1fr)_320px] desktop:items-start desktop:gap-8 desktop:px-10">
      <aside>
        <SocialLeftRail onCreatePost={() => setIsCreatePostOpen(true)}>
          <div className="hidden desktop:block">
            <SocialFilter
              city={city}
              setCity={setCity}
              eventId={eventId}
              setEventId={setEventId}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </SocialLeftRail>
      </aside>

      <div className="min-w-0">
        <SocialFeedHeader
          search={search}
          setSearch={setSearch}
          action={
            <SocialFilterTrigger
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              panelId={mobileFilterPanelId}
              className="desktop:hidden"
            />
          }
          panel={
            isFilterOpen ? (
              <SocialFilter
                id={mobileFilterPanelId}
                className="mt-4 desktop:hidden"
                city={city}
                setCity={setCity}
                eventId={eventId}
                setEventId={setEventId}
                sort={sort}
                setSort={setSort}
              />
            ) : null
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <FeedList posts={posts} emptyMessage={eventId ? t("emptyEventPhotos") : t("emptyPosts")} />
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div ref={loadMoreRef} />
      </div>

      <aside className="hidden desktop:block">
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
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
      <Dialog open={isLoginWallOpen} onOpenChange={setIsLoginWallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("loginWallTitle")}</DialogTitle>
            <DialogDescription>{t("loginWallBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => router.push("/login?next=/social")}>
              {t("signIn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SocialPage;

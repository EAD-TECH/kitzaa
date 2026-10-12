"use client"

import { useTranslations } from "next-intl"
import { MessageSquare } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { LoadMoreButton } from "@/components/shared/LoadMoreButton"
import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"
import { MyPostCard } from "@/features/social/components/MyPostCard"
import { useMyPosts } from "@/features/social/hooks/socialHooks"

const MeineBeitraegePage = () => {
  const t = useTranslations("Profile")
  const social = useTranslations("Social")
  const { posts, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useMyPosts()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-22 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-12 flex items-center justify-center py-20 text-center text-muted-foreground">
        <p>{social("errorTitle")}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <ProfileEmptyState
        icon={MessageSquare}
        title={t("emptyPostsTitle")}
        description={t("emptyPostsBody")}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <MyPostCard key={post._id} post={post} />
        ))}
      </div>
      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />
    </div>
  )
}

export default MeineBeitraegePage

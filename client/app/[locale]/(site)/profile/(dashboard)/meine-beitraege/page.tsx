"use client"

import { MessageSquare } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"
import { MyPostCard } from "@/features/social/components/MyPostCard"
import { useMyPosts } from "@/features/social/hooks/socialHooks"

const MeineBeitraegePage = () => {
  const { posts, isLoading, isError } = useMyPosts()

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
        <p>Beiträge konnten nicht geladen werden.</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <ProfileEmptyState
        icon={MessageSquare}
        title="Noch keine Beiträge"
        description="Deine geteilten Beiträge erscheinen hier, sobald du einen veröffentlichst."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <MyPostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

export default MeineBeitraegePage

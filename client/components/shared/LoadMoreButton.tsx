"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LoadMoreButtonProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

export function LoadMoreButton({ hasNextPage, isFetchingNextPage, onLoadMore }: LoadMoreButtonProps) {
  if (!hasNextPage) return null

  return (
    <div className="flex justify-center pt-8">
      <Button variant="outline" onClick={onLoadMore} disabled={isFetchingNextPage}>
        {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
        Mehr laden
      </Button>
    </div>
  )
}

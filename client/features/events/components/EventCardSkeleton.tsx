import { ImageIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const BEIGE = "bg-[oklch(0.92_0.015_85)]"

export default function EventCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className={`flex aspect-2/1 w-full items-center justify-center ${BEIGE}`}>
        <ImageIcon className="size-6 text-muted-foreground/40" />
      </div>

      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className={`h-3 w-24 ${BEIGE}`} />
          <Skeleton className={`h-4 w-16 rounded-full ${BEIGE}`} />
        </div>

        <Skeleton className={`h-4 w-3/4 ${BEIGE}`} />
        <Skeleton className={`h-3 w-1/2 ${BEIGE}`} />

        <div className="mt-1 flex items-center justify-between gap-2 border-t border-border pt-2">
          <Skeleton className={`h-3 w-20 ${BEIGE}`} />
        </div>
      </CardContent>
    </Card>
  )
}

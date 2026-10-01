import { Skeleton } from "@/components/ui/skeleton"

const BEIGE = "bg-[oklch(0.92_0.015_85)]"

export default function EventListRowSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-5 desktop:gap-6">
      <div className="flex items-baseline gap-1 py-6">
        <Skeleton className={`h-8 w-9 ${BEIGE}`} />
      </div>

      <div className="flex items-stretch gap-4 border-t border-border py-6 desktop:gap-6">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div>
            <Skeleton className={`h-5 w-24 rounded-full ${BEIGE}`} />
            <Skeleton className={`mt-3 h-4 w-3/4 ${BEIGE}`} />
            <Skeleton className={`mt-2 h-3 w-1/2 ${BEIGE}`} />
          </div>
          <Skeleton className={`h-4 w-28 ${BEIGE}`} />
        </div>

        <Skeleton className={`w-28 shrink-0 rounded-xl tablet:w-40 desktop:w-48 ${BEIGE}`} />
      </div>
    </div>
  )
}

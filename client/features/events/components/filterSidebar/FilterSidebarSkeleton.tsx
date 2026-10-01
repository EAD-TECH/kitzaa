import { Skeleton } from "@/components/ui/skeleton"

const BEIGE = "bg-[oklch(0.92_0.015_85)]"

function FilterGroupSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className={`h-3 w-20 ${BEIGE}`} />
      <Skeleton className={`h-8 w-full ${BEIGE}`} />
      <Skeleton className={`h-8 w-full ${BEIGE}`} />
      <Skeleton className={`h-8 w-2/3 ${BEIGE}`} />
    </div>
  )
}

export default function FilterSidebarSkeleton() {
  return (
    <aside className="flex w-full max-w-xs flex-col gap-8 rounded-lg bg-sidebar p-7">
      <div className="flex items-center gap-2 border-b border-border/60 pb-4">
        <Skeleton className={`size-5 ${BEIGE}`} />
        <Skeleton className={`h-6 w-16 ${BEIGE}`} />
      </div>

      <FilterGroupSkeleton />
      <FilterGroupSkeleton />
      <FilterGroupSkeleton />
    </aside>
  )
}

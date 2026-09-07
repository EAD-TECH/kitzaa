import { Skeleton } from "@/components/ui/skeleton"

const ProfileHeaderSkeleton = () => {
  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 tablet:p-8">
      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-center">
        <Skeleton className="size-24 shrink-0 rounded-full tablet:size-28" />
        <div className="flex flex-1 flex-col gap-2.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-3 w-24" />
          <div className="mt-1 flex flex-wrap gap-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-5 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileHeaderSkeleton

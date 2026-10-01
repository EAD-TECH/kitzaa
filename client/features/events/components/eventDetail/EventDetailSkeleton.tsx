import { Skeleton } from "@/components/ui/skeleton"

const EventDetailSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 tablet:px-10">
      <Skeleton className="h-3 w-40" />

      <div className="grid gap-10 desktop:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-8">
          <Skeleton className="aspect-[5/2] w-full rounded-2xl" />

          <Skeleton className="h-7 w-2/3 tablet:h-8" />

          <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-2.5 w-12" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-8">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-8 max-w-lg">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
              <Skeleton className="aspect-video w-full shrink-0 rounded-2xl tablet:w-64" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6 tablet:grid tablet:grid-cols-2 desktop:flex desktop:flex-col">
          <div className="order-3 flex w-full flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 tablet:col-span-2 tablet:mx-auto tablet:mt-10 tablet:max-w-xl desktop:order-1 desktop:mx-0 desktop:mt-0 desktop:max-w-none">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>

          <div className="order-1 flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 desktop:order-2">
            <Skeleton className="h-3 w-36" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          </div>

          <div className="order-2 flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 desktop:order-3">
            <Skeleton className="h-3 w-24" />
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="size-8 shrink-0 rounded-full ring-2 ring-background" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default EventDetailSkeleton

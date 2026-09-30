import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanSkeleton() {
  return (
    <div className="mx-auto mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 desktop:flex desktop:overflow-x-auto">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full flex-col gap-4 border border-kanban-card-border p-4 desktop:w-80 desktop:shrink-0"
        >
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-24 bg-muted" />
            <Skeleton className="h-6 w-8 rounded-full bg-muted" />
          </div>

          {[1, 2].map((cardIndex) => (
            <div
              key={cardIndex}
              className="p-4 rounded-xl border border-border bg-white flex flex-col gap-3"
            >
              <Skeleton className="h-5 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
              <Skeleton className="h-6 w-20 rounded-full mt-2 bg-muted" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

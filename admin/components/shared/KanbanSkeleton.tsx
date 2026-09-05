import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanSkeleton() {
  return (
    <div className="flex w-full mx-auto overflow-x-auto mt-6 flex-row gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 min-w-80 w-80 p-4 border border-kanban-card-border"
        >
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-24 bg-(--cream-200)" />
            <Skeleton className="h-6 w-8 rounded-full bg-(--cream-200)" />
          </div>

          {[1, 2].map((cardIndex) => (
            <div
              key={cardIndex}
              className="p-4 rounded-xl border border-border bg-white flex flex-col gap-3"
            >
              <Skeleton className="h-5 w-3/4 bg-(--cream-200)" />
              <Skeleton className="h-4 w-1/2 bg-(--cream-200)" />
              <Skeleton className="h-6 w-20 rounded-full mt-2 bg-(--cream-200)" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

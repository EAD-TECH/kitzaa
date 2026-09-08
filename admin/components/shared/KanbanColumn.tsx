import { cn } from "@/lib/utils";
import type { KanbanColumnProps } from "./types";

export default function KanbanColumn({
  title,
  count,
  dotColor,
  children,
}: KanbanColumnProps) {
  return (
    <div className="flex min-h-80 w-full max-w-xs shrink-0 flex-col gap-4 rounded-2xl border border-border bg-(--cream-100) p-3">
      <div className="flex w-full items-center gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              dotColor ?? "bg-primary",
            )}
          />
          <h2 className="font-heading text-xl font-normal leading-7 text-kanban-card-title">
            {title}
          </h2>
        </div>
        <span className="rounded-md bg-card px-2 py-0.5 text-sm text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

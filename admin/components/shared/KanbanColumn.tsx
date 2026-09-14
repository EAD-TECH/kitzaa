import { cn } from "@/lib/utils";
import type { KanbanColumnProps } from "./types";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function KanbanColumn({
  title,
  count,
  dotColor,
  children,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: KanbanColumnProps) {
  /* sensor olustr */
  const sensorRef = useRef<HTMLDivElement>(null);

  /* kamera */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          if (fetchNextPage) fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (sensorRef.current) {
      observer.observe(sensorRef.current);
    }
    return () => observer.disconnect(); // Bileşen kapandığında kamerayı kapat
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div className="flex min-h-0 min-w-0 w-full shrink-0 flex-col gap-4 rounded-2xl border border-border bg-kanban-column-bg p-3 sm:min-h-80 desktop:w-80 desktop:max-w-none">
      <div className="flex w-full items-center gap-2 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              dotColor ?? "bg-primary",
            )}
          />
          <h2 className="font-headin min-w-0 sm:text-sm wrap-break-word text-xl font-normal leading-7 text-kanban-card-title">
            {title}
          </h2>
        </div>
        <span className="rounded-md sm:text-xs sm:px-1 shrink-0 bg-card px-2 py-0.5 text-sm text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
      {hasNextPage && (
        <div
          ref={sensorRef}
          className="flex w-full items-center justify-center p-4"
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-terracotta-500" />
          ) : (
            <span className="text-xs text-muted-foreground">
              Daha fazla yükleniyor...
            </span>
          )}
        </div>
      )}
    </div>
  );
}

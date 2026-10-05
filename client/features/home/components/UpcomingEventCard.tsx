import Image from "next/image";
import NextLink from "next/link";
import { Calendar, PartyPopper } from "lucide-react";
import { formatAgeRanges } from "@/features/events/utils/ageRange";
import type { EventDTO } from "@/features/events/types/event.types";

interface UpcomingEventCardProps {
  event: EventDTO;
}

function getCategoryName(categoryId: EventDTO["categoryId"]) {
  return typeof categoryId === "string" ? null : categoryId.name;
}

function formatEventDate(startDate: string) {
  return new Date(startDate).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
  });
}

export function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  const categoryName = getCategoryName(event.categoryId);

  return (
    <NextLink
      href={`/events/${event.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-secondary/15">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PartyPopper className="size-6 text-muted-foreground/40" />
          </div>
        )}

        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-md">
            {categoryName}
          </span>
        )}
      </div>

      <h3 className="truncate font-heading text-xl leading-snug font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {event.title}
      </h3>

      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" />
          {formatEventDate(event.schedule.startDate)}
        </span>
        <span aria-hidden="true">·</span>
        <span>{formatAgeRanges(event.ageRanges)}</span>
      </span>
    </NextLink>
  );
}

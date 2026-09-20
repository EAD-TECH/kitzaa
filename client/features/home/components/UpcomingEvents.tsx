import Image from "next/image";
import NextLink from "next/link";
import { ArrowRight, Calendar, PartyPopper } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { FadeInOnView } from "@/components/motion/FadeInOnView";
import { Link } from "@/i18n/navigation";
import { getUpcomingEventsServer } from "@/features/events/api/eventApi.server";
import { formatAgeRange } from "@/features/events/utils/ageRange";
import type { EventDTO } from "@/features/events/types/event.types";

function getCategoryName(categoryId: EventDTO["categoryId"]) {
  return typeof categoryId === "string" ? null : categoryId.name;
}

function formatEventDate(startDate: string) {
  return new Date(startDate).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
  });
}

// Wellenförmige Kante statt einer geraden Linie zwischen Seiten- und
// Panel-Hintergrund.
const WAVE_PATH =
  "M0,60 C120,90 240,90 360,60 C480,30 600,30 720,60 C840,90 960,90 1080,60 C1200,30 1320,30 1440,60 L1440,120 L0,120 Z";

export async function UpcomingEvents() {
  const t = await getTranslations("HomePage");
  const { events } = await getUpcomingEventsServer(4);

  if (events.length === 0) return null;

  return (
    <section className="pb-16 tablet:pb-20">
      <div className="bg-surface-accent pt-16 pb-10 tablet:pt-20 tablet:pb-14">
        <div className="mx-auto mb-10 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 tablet:mb-14 tablet:px-10 desktop:px-10">
          <h2 className="font-heading text-2xl font-semibold text-foreground tablet:text-3xl">
            {t("upcomingEventsTitle")}
          </h2>
          <Button
            className="rounded-full border-none bg-secondary/20 text-foreground hover:bg-secondary/30"
            nativeButton={false}
            render={<Link href="/events" />}
          >
            {t("viewAllEvents")}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 tablet:grid-cols-2 tablet:px-10 desktop:grid-cols-4 desktop:px-10">
          {events.map((event, index) => {
            const categoryName = getCategoryName(event.categoryId);

            return (
              <FadeInOnView key={event._id} delay={index * 260}>
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
                        sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
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
                    <span>{event.ageRange ? formatAgeRange(event.ageRange) : "Alle Alter"}</span>
                  </span>
                </NextLink>
              </FadeInOnView>
            );
          })}
        </div>
      </div>

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="-scale-y-100 block h-8 w-full tablet:h-12"
      >
        <path d={WAVE_PATH} className="fill-surface-accent" />
      </svg>
    </section>
  );
}

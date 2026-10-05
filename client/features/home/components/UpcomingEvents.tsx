import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { FadeInOnView } from "@/components/motion/FadeInOnView";
import { Link } from "@/i18n/navigation";
import { getUpcomingEventsServer } from "@/features/events/api/eventApi.server";
import { UpcomingEventCard } from "./UpcomingEventCard";

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
      <div className="bg-surface-accent pt-14 pb-10 tablet:pt-16 tablet:pb-14">
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
          {events.map((event, index) => (
            <FadeInOnView key={event._id} delay={index * 260}>
              <UpcomingEventCard event={event} />
            </FadeInOnView>
          ))}
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

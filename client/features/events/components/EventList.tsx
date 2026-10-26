import EventListRow from "./EventListRow";
import { getApprovedEventCountServer, getEventsServer } from "../api/eventApi.server";
import { hasActiveEventFilters } from "../api/buildEventQuery";
import LoadMoreEvents from "./LoadMoreEvents";
import { FadeInOnView } from "@/components/motion/FadeInOnView";
import { getTranslations } from "next-intl/server";

interface EventListProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const EVENT_GRID_CLASSNAME =
  "grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0";

export const EVENT_LIST_CLASSNAME = "flex flex-col desktop:max-w-270";

const EventList = async ({ searchParams }: EventListProps) => {
  const isFiltered = hasActiveEventFilters(searchParams);
  const [{ events, details }, approvedTotal] = await Promise.all([
    getEventsServer(searchParams),
    isFiltered ? getApprovedEventCountServer() : Promise.resolve(null),
  ]);

  const foundCount = details.count;
  const totalCount = approvedTotal ?? foundCount;
  const t = await getTranslations("Events");

  const countLabel = isFiltered
    ? `${t("ofTotal", { total: totalCount })} ${t("eventsWord", { count: totalCount })}`
    : t("eventsWord", { count: foundCount });

  const nextPage =
    details.pages !== false && details.pages.next !== false
      ? details.pages.next
      : null;

  return (
    <>
      {foundCount === 0 ? (
        <div className="mb-2 flex items-center gap-4">
          <p className="font-heading text-sm font-medium text-foreground">
            {t("noEventsFound")}
          </p>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
      ) : (
        <div className="mb-1 flex items-center gap-4">
          <p className="flex items-baseline gap-2">
            <span className="font-heading text-2xl leading-none font-semibold tracking-tight text-foreground tabular-nums">
              {foundCount}
            </span>
            <span className="font-heading text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {countLabel}
            </span>
          </p>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
      )}
      {foundCount > 0 && (
        <>
          <div className={`mb-15 ${EVENT_LIST_CLASSNAME}`}>
            {events.map((event, index) => (
              <FadeInOnView
                key={event._id}
                delay={(index % 4) * 100}
                duration={700}
              >
                <EventListRow event={event} />
              </FadeInOnView>
            ))}
          </div>
          <LoadMoreEvents initialNextPage={nextPage} />
        </>
      )}
    </>
  );
};

export default EventList;

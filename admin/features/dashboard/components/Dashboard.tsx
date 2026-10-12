"use client";

import PageHeader from "@/components/shared/PageHeader";

import AdminLiveWidget from "../live-widget/components/AdminLiveWidget";
import StatsCard from "@/components/shared/dashboard/StatsCard";
import {
  AlertCircle,
  CalendarDays,
  Users,
} from "lucide-react";
import OverviewChart from "@/components/shared/dashboard/OverviewChart";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useEventApplications } from "@/features/events/hooks/useEventApplications";
import { useOrganizerApplications } from "@/features/organizer-applications/hooks/useOrganizerApplications";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import EventDrawer from "@/features/events/components/EventDrawer";
import { useRouter } from "next/navigation";
import ReusableDrawer from "@/components/shared/drawer/ReusableDrawer";

function readListCount(details: unknown) {
  if (
    details &&
    typeof details === "object" &&
    "count" in details &&
    typeof details.count === "number"
  ) {
    return details.count;
  }
  return undefined;
}

function cardValue(
  value: number | undefined,
  isLoading: boolean,
  isError: boolean,
) {
  if (isLoading) return "…";
  if (isError) return "—";
  return value ?? 0;
}

export default function Dashboard() {
  const router = useRouter();
  const today = new Date();
  const humanReadable = today.toLocaleDateString("en-EN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const machineReadable = today.toISOString().split("T")[0];
  const { data, isLoading, isError } = useDashboardSummary();
  const summary = data?.summary;
  const summaryLoading = isLoading && !summary;
  const summaryFailed = isError && !summary;
  const summaryNote = summaryFailed ? "Zusammenfassung konnte nicht geladen werden" : undefined;

  const {
    data: eventData,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useEventApplications({
    kolonStatus: "pending",
    secilenKategori: "",
    limit: 6,
  });
  const {
    data: organizerData,
    isLoading: organizersLoading,
    isError: organizersError,
  } = useOrganizerApplications({
    arananKelime: undefined,
    kolonStatus: "pending",
    limit: 6,
  });

  const pendingEvents = eventData?.pages.flatMap((p) => p.events || []) || [];
  const pendingOrganizers =
    organizerData?.pages.flatMap((p) => p.applications || []) || [];
  const hiddenEvents = Math.max(
    (readListCount(eventData?.pages[0]?.details) ?? pendingEvents.length) -
      pendingEvents.length,
    0,
  );
  const hiddenOrganizers = Math.max(
    (readListCount(organizerData?.pages[0]?.details) ??
      pendingOrganizers.length) - pendingOrganizers.length,
    0,
  );
  const pendingListsLoading =
    (eventsLoading || organizersLoading) &&
    pendingEvents.length === 0 &&
    pendingOrganizers.length === 0;

  return (
    <main className="flex flex-col gap-6 px-4 md:gap-8 md:px-6">
      <section>
        <PageHeader
          title="Operations-Dashboard"
          description="Verwalten Sie heutige Anträge, die Veranstaltungsauslastung und Teamaktionen auf einen Blick."
          dateText={humanReadable}
          machineDate={machineReadable}
        />
      </section>

      {/* Stats kartları bu alanı dolduracak */}
      <section className="mt-6 grid min-h-40 lg:grid-cols-3 grid-cols-1  gap-4 tablet:grid-cols-2">
        <HoverCard>
          <HoverCardTrigger
            render={
              <div className="h-full cursor-pointer">
                {" "}
                <StatsCard
                  data={{
                    title: "Ausstehende Genehmigungen",
                    value: cardValue(
                      summary?.pendingApprovals,
                      summaryLoading,
                      summaryFailed,
                    ),
                    description: summaryNote,
                    icon: <AlertCircle className="text-primary" size={20} />,
                  }}
                />
              </div>
            }
          ></HoverCardTrigger>

          <HoverCardContent side="top">
            <h4 className="mb-2 text-sm font-semibold">Ausstehende Vorgänge</h4>
            {pendingListsLoading ? (
              <p className="text-sm text-muted-foreground">Wird geladen…</p>
            ) : eventsError &&
              organizersError &&
              pendingEvents.length === 0 &&
              pendingOrganizers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Liste konnte nicht geladen werden</p>
            ) : pendingEvents.length === 0 &&
              pendingOrganizers.length === 0 &&
              !eventsError &&
              !organizersError ? (
              <p className="text-sm text-muted-foreground">Keine ausstehenden Vorgänge</p>
            ) : (
              <div className="flex flex-col gap-3">
                {(pendingEvents.length > 0 || eventsError) && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">Veranstaltungen</p>
                    {eventsError && pendingEvents.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Veranstaltungen konnten nicht geladen werden
                      </p>
                    )}
                    {pendingEvents.map((event) => (
                      <div
                        onClick={() =>
                          router.push(`/events?applicationId=${event._id}`)
                        }
                        key={event._id}
                        className="cursor-pointer pb-1 text-sm"
                      >
                        {event.title}
                      </div>
                    ))}
                    {hiddenEvents > 0 && (
                      <button
                        type="button"
                        onClick={() => router.push("/events")}
                        className="cursor-pointer text-left text-xs text-muted-foreground"
                      >
                        +{hiddenEvents} weitere Veranstaltungen
                      </button>
                    )}
                  </div>
                )}
                {(pendingOrganizers.length > 0 || organizersError) && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">
                      Organisationsanträge
                    </p>
                    {organizersError && pendingOrganizers.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Anträge konnten nicht geladen werden
                      </p>
                    )}
                    {pendingOrganizers.map((application) => (
                      <div
                        onClick={() =>
                          router.push(
                            `/organizer-applications?applicationId=${application._id}`,
                          )
                        }
                        key={application._id}
                        className="cursor-pointer pb-1 text-sm"
                      >
                        {application.institutionData.name}
                      </div>
                    ))}
                    {hiddenOrganizers > 0 && (
                      <button
                        type="button"
                        onClick={() => router.push("/organizer-applications")}
                        className="cursor-pointer text-left text-xs text-muted-foreground"
                      >
                        +{hiddenOrganizers} weitere Anträge
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </HoverCardContent>
        </HoverCard>

        <StatsCard
          data={{
            title: "Veranstaltungen insgesamt",
            value: cardValue(summary?.totalEvents, summaryLoading, summaryFailed),
            description: summaryNote,
            icon: <CalendarDays className="text-primary" size={20} />,
            trends: summary?.trends,
            trendKey: "events",
          }}
        />
        <StatsCard
          data={{
            title: "Teilnehmende insgesamt",
            value: cardValue(
              summary?.totalParticipants,
              summaryLoading,
              summaryFailed,
            ),
            description: summaryNote,
            icon: <Users className="text-primary" size={20} />,
            trends: summary?.trends,
            trendKey: "participants",
          }}
        />
      </section>
      <section>
        <OverviewChart trends={summary?.trends ?? []} />
      </section>

      {/* Canli akıs kısmı */}
      <section className="grid grid-cols-1 tablet:grid-cols-3">
        {/* canlı akıs */}
        <div className="col-span-1 flex h-112 min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card p-0 shadow-kanban-card tablet:col-span-3">
          <AdminLiveWidget />
        </div>
      </section>
      <EventDrawer />
      <ReusableDrawer/>
    </main>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Ortak UI parçaları
import ReusableDrawerHeader from "@/components/shared/drawer/ReusableDraweHeader";
import SectionShell from "@/components/shared/drawer/SectionShell";
import InfoSection from "@/components/shared/drawer/InfoSection";

import { useEventReject } from "../hooks/useEventReject";
import { useEventCancel } from "../hooks/useEventCancel";
import { AdminEventDTO } from "../types";
import { useEventById } from "../hooks/useEventByID";
import { useApproveEvent } from "../hooks/useApproveEvent";
import {
  eventActionSchema,
  type ReviewEventFormValues,
} from "@/features/validations/ReviewApplicationForm";
import SectionAIBox from "@/components/shared/drawer/SectionAIBox";

const formDefaults = {
  status: undefined,
  note: "",
} as unknown as ReviewEventFormValues;

export default function EventDrawer() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const eventId = params.get("applicationId");
  const isOpen = Boolean(eventId);

  const { data: response, isLoading } = useEventById(eventId);
  const eventData = response?.event as AdminEventDTO;

  /* kamyonlarım */
  const { mutate: approveEvent, isPending: isApproving } = useApproveEvent();
  const { mutate: rejectEvent, isPending: isRejecting } = useEventReject();
  const { mutate: cancelEvent, isPending: isCanceling } = useEventCancel();

  const isWorking = isApproving || isRejecting || isCanceling;

  const form = useForm<ReviewEventFormValues>({
    resolver: zodResolver(eventActionSchema),
    defaultValues: formDefaults,
  });
  const formattedDate = eventData?.createdAt
    ? new Date(eventData.createdAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const organizerName =
    typeof eventData?.createdBy === "object"
      ? eventData.createdBy?.username
      : eventData?.createdBy;

  const categoryName =
    typeof eventData?.categoryId === "object"
      ? eventData.categoryId?.name
      : eventData?.categoryId;

  const scheduleLabel = (() => {
    const schedule = eventData?.schedule;
    if (!schedule?.startDate) return null;

    const dateObj = new Date(schedule.startDate);
    if (Number.isNaN(dateObj.getTime())) return null;

    const dayMonth = dateObj.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
    });
    const timeRange = [schedule.startTime, schedule.endTime]
      .filter(Boolean)
      .join(" - ");
    const recurring = schedule.isRecurring ? " (Tekrarlı)" : "";

    return `${dayMonth}${timeRange ? ` • ${timeRange}` : ""}${recurring}`;
  })();

  const locationLabel = (() => {
    const location = eventData?.location;
    if (!location) return null;

    return (
      [location.venueName, location.addressLine, location.city]
        .filter(Boolean)
        .join(", ") || null
    );
  })();

  const locationTypeLabel =
    eventData?.locationType === "indoor"
      ? "İç mekan"
      : eventData?.locationType === "outdoor"
        ? "Açık hava"
        : eventData?.locationType === "online"
          ? "Online"
          : null;

  const priceLabel = eventData?.isFree
    ? "Ücretsiz"
    : eventData?.price?.amount
      ? `${eventData.price.amount} ${eventData.price.currency ?? ""}`.trim()
      : null;

  function onSubmit(data: ReviewEventFormValues) {
    if (!eventId) return;

    if (data.status === "approved") {
      approveEvent(eventId, { onSuccess: () => handleDrawerClose(false) });
    } else if (data.status === "rejected") {
      rejectEvent(
        { id: eventId, body: { rejectedReason: data.note ?? "" } },
        { onSuccess: () => handleDrawerClose(false) },
      );
    } else if (data.status === "cancelled") {
      cancelEvent(
        { id: eventId, body: { cancelledReason: data.note ?? "" } },
        { onSuccess: () => handleDrawerClose(false) },
      );
    }
  }

  function handleDrawerClose(open: boolean) {
    if (!open) {
      const currentParams = new URLSearchParams(params.toString());
      currentParams.delete("applicationId");
      router.replace(
        currentParams.toString()
          ? `${pathname}?${currentParams.toString()}`
          : pathname,
      );
      form.reset(formDefaults);
    }
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleDrawerClose}
      swipeDirection="right"
    >
      <DrawerContent>
        <ReusableDrawerHeader
          title="Eventdetails"
          tag={eventData?.title ?? "Wird geladen..."}
          subtitle={formattedDate ? `Verwaltung · ${formattedDate}` : "Verwaltung"}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex flex-col gap-8 flex-1 overflow-y-auto px-6 py-6">
              <SectionShell title="Eventinformationen" columns={2}>
                {isLoading ? (
                  <div className="p-4 text-sm text-primary">Wird geladen...</div>
                ) : (
                  <>
                    <InfoSection label="Organisator">
                      {organizerName || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Status">
                      <span className="capitalize">
                        {eventData?.status || "Nicht angegeben"}
                      </span>
                    </InfoSection>
                    <InfoSection label="Kategorie">
                      {categoryName || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Altersgruppe">
                      {eventData?.ageRanges?.length
                        ? eventData.ageRanges.join(", ")
                        : "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Datum / Uhrzeit" wide>
                      {scheduleLabel || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Ort" wide>
                      {locationLabel || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Veranstaltungsort">
                      {locationTypeLabel || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Kapasite">
                      {eventData?.capacity
                        ? `${eventData.capacity.current} / ${eventData.capacity.max}`
                        : "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Preis">
                      {priceLabel || "Nicht angegeben"}
                    </InfoSection>
                    {(eventData?.status === "rejected" ||
                      eventData?.status === "cancelled") && (
                      <InfoSection
                        wide
                        label={
                          eventData.status === "rejected"
                            ? "Ablehnungsgrund"
                            : "Stornierungsgrund"
                        }
                      >
                        {eventData.status === "rejected"
                          ? eventData.rejectedReason || "Kein Grund angegeben"
                          : eventData.cancelledReason || "Kein Grund angegeben"}
                      </InfoSection>
                    )}
                  </>
                )}
              </SectionShell>

              <SectionAIBox aiAnalysis={eventData?.aiAnalysis} />

              <div className="flex flex-col gap-3">
                <h2 className="font-heading uppercase text-xs text-primary">
                  Eventbeschreibung
                </h2>
                <div className="pl-4 flex flex-col gap-2 rounded-l border-l-2 border-l-primary bg-muted p-2">
                  <p className="font-body text-xs leading-7 italic">
                    {eventData?.description ||
                      "Es wurde keine spezielle Beschreibung für dieses Event übermittelt."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {(eventData?.status === "pending" ||
                  eventData?.status === "approved") && (
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading text-primary">
                          {eventData?.status === "pending"
                            ? "Ablehnungsgrund (erforderlich)"
                            : "Stornierungsgrund (erforderlich)"}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              eventData?.status === "pending"
                                ? "Grund für die Ablehnung eingeben"
                                : "Grund für die Stornierung eingeben"
                            }
                            className="focus-visible:ring-0 bg-muted border-none resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <DrawerFooter className="bg-sidebar flex-row items-center justify-between border-t px-6 py-4">
              <DrawerClose
                render={
                  <Button type="button" variant="ghost">
                    Abbrechen
                  </Button>
                }
              />

              <div className="flex flex-row flex-wrap gap-2">
                {eventData?.status === "pending" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "approved")}
                  >
                    {isApproving ? "Wird genehmigt..." : "Genehmigen"}
                  </Button>
                )}

                {eventData?.status === "pending" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "rejected")}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isRejecting ? "Wird abgelehnt..." : "Ablehnen"}
                  </Button>
                )}

                {eventData?.status === "approved" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "cancelled")}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isCanceling ? "Wird storniert..." : "Stornieren"}
                  </Button>
                )}
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

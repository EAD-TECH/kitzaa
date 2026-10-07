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
import { AGE_RANGE_LABELS, EVENT_STATUS_LABELS } from "../types/events";
import { useEventById } from "../hooks/useEventByID";
import { useApproveEvent } from "../hooks/useApproveEvent";
import {
  eventActionSchema,
  type ReviewEventFormValues,
} from "@/features/validations/ReviewApplicationForm";

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
    ? new Date(eventData.createdAt).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
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
          title="Event-Details"
          tag={eventData?.title ?? "Wird geladen..."}
          subtitle={
            formattedDate ? `Erstellt am: ${formattedDate}` : "Betrieb"
          }
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="min-h-0 flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-4 py-4 tablet:px-6 tablet:py-6">
              <SectionShell title="Event-Informationen" columns={2}>
                {isLoading ? (
                  <div className="p-4 text-sm text-primary">Wird geladen...</div>
                ) : (
                  <>
                    <InfoSection label="Titel">
                      {eventData?.title || "Nicht angegeben"}
                    </InfoSection>

                    <InfoSection label="Organisator">
                      {typeof eventData?.createdBy === "object"
                        ? eventData.createdBy?.username
                        : eventData?.createdBy || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Status">
                      {eventData?.status
                        ? EVENT_STATUS_LABELS[eventData.status]
                        : "Nicht angegeben"}
                    </InfoSection>
                    {(eventData?.status === "rejected" ||
                      eventData?.status === "cancelled") && (
                      <InfoSection
                        wide
                        label={
                          eventData.status === "rejected"
                            ? "Ablehnungsgrund"
                            : "Absagegrund"
                        }
                      >
                        {eventData.status === "rejected"
                          ? eventData.rejectedReason || "Kein Grund angegeben"
                          : eventData.cancelledReason || "Kein Grund angegeben"}
                      </InfoSection>
                    )}

                    <InfoSection label="Kategorie">
                      {typeof eventData?.categoryId === "object"
                        ? eventData.categoryId?.name || "Nicht angegeben"
                        : eventData?.categoryId || "Nicht angegeben"}
                    </InfoSection>

                    <InfoSection label="Altersgruppen">
                      {eventData?.ageRanges?.length
                        ? eventData.ageRanges
                            .map((range) => AGE_RANGE_LABELS[range] ?? range)
                            .join(", ")
                        : "Nicht angegeben"}
                    </InfoSection>

                    <InfoSection label="Beschreibung" wide>
                      {eventData?.description || "Nicht angegeben"}
                    </InfoSection>

                    <InfoSection label="Teilnehmer">
                      {eventData?.capacity
                        ? `${eventData.capacity.current} Personen`
                        : "Unbegrenzt/Nicht angegeben"}
                    </InfoSection>

                    <InfoSection label="Kapazität">
                      {eventData?.capacity
                        ? `${eventData.capacity.max} Personen`
                        : "Unbegrenzt/Nicht angegeben"}
                    </InfoSection>

                    <InfoSection label="Kostenpflichtig/Kostenlos">
                      {eventData?.isFree ? "Kostenlos" : "Kostenpflichtig"}
                    </InfoSection>

                    <InfoSection label="Preis">
                      {eventData?.price?.amount || "Nicht angegeben"}
                    </InfoSection>
                  </>
                )}
              </SectionShell>

              <div className="flex flex-col gap-3">
                {(eventData?.status === "pending" ||
                  eventData?.status === "approved") && (
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading text-primary">
                          Notiz / Ablehnungs- oder Absagegrund
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Gib einen Grund ein."
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

            <DrawerFooter className="bg-sidebar flex flex-col gap-2 border-t px-4 py-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6">
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
                {eventData?.status === "pending" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "cancelled")}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isCanceling ? "Wird abgesagt..." : "Absagen"}
                  </Button>
                )}

                {eventData?.status === "approved" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "cancelled")}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isCanceling ? "Wird abgesagt..." : "Absagen"}
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

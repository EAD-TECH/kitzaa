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

import { useEventReject } from "../../hooks/useEventReject";
import { useEventCancel } from "../../hooks/useEventCancel";
import { AdminEventDTO } from "../../types";
import { useEventById } from "../../hooks/useEventByID";
import { useApproveEvent } from "../../hooks/useApproveEvent";
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
    ? new Date(eventData.createdAt).toLocaleDateString("tr-TR", {
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
      <DrawerContent className="h-dvh max-h-dvh min-h-0  max-w-full overflow-hidden tablet:w-(30rem) w-[min(30rem,75vw)] rounded-r-none rounded-l-xl [--drawer-inset:0px]">
        <ReusableDrawerHeader
          title="Etkinlik Detayı"
          tag={eventData?.title ?? "Yükleniyor..."}
          subtitle={
            formattedDate ? `Oluşturulma: ${formattedDate}` : "Operasyon"
          }
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="min-h-0 flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-4 py-4 tablet:px-6 tablet:py-6">
              <SectionShell title="Etkinlik Bilgileri">
                {isLoading ? (
                  <div className="p-4 text-sm text-primary">
                    Yükleniyor...
                  </div>
                ) : (
                  <>
                    <InfoSection label="Başlık">
                      {eventData?.title || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Organizatör">
                      {typeof eventData?.createdBy === "object"
                        ? eventData.createdBy?.username
                        : eventData?.createdBy || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Durum">
                      <span className="capitalize">
                        {eventData?.status || "Belirtilmemiş"}
                      </span>
                    </InfoSection>
                    {(eventData?.status === "rejected" ||
                      eventData?.status === "cancelled") && (
                      <InfoSection
                        label={
                          eventData.status === "rejected"
                            ? "Red sebebi"
                            : "İptal sebebi"
                        }
                      >
                        {eventData.status === "rejected"
                          ? eventData.rejectedReason || "Sebep yok"
                          : eventData.cancelledReason || "Sebep yok"}
                      </InfoSection>
                    )}

                    <InfoSection label="Kategori">
                      {typeof eventData?.categoryId === "object"
                        ? eventData.categoryId?.name || "Belirtilmemiş"
                        : eventData?.categoryId || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Yaş Aralığı">
                      {eventData?.ageRange || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Açıklama">
                      {eventData?.description || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Katılım">
                      {eventData?.capacity
                        ? `${eventData.capacity.current} Kişi`
                        : "Sınırsız/Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Kapasite">
                      {eventData?.capacity
                        ? `${eventData.capacity.max} Kişi`
                        : "Sınırsız/Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Ücretli/Ücretsiz">
                      <span className="capitalize">
                        {eventData?.isFree ? "Ücretsiz" : "Ücretli"}
                      </span>
                    </InfoSection>

                    <InfoSection label="Ücret">
                      {eventData?.price?.amount || "Belirtilmemiş"}
                    </InfoSection>

                    
                  </>
                )}
              </SectionShell>

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading text-primary">
                        İşlem Notu / Red & İptal Sebebi
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Red veya İptal ediyorsanız sebebini yazmak zorunludur."
                          className="focus-visible:ring-0 bg-muted border-none resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DrawerFooter className="bg-sidebar flex flex-col gap-2 border-t px-4 py-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6">
              <DrawerClose
                render={
                  <Button type="button" variant="ghost">
                    Vazgeç
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
                    {isApproving ? "Onaylanıyor..." : "Onayla"}
                  </Button>
                )}

                {eventData?.status === "pending" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "rejected")}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isRejecting ? "Reddediliyor..." : "Reddet"}
                  </Button>
                )}

                {eventData?.status === "approved" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "cancelled")}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isCanceling ? "İptal Ediliyor..." : "İptal Et"}
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

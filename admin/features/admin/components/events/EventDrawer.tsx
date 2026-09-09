"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

// YAZDIĞIMIZ 4 KURYE
/* import { useEventById } from "../../hooks/useEventById";
import { useApproveEvent } from "../../hooks/useApproveEvent";
import { useRejectEvent } from "../../hooks/useRejectEvent";
import { useCancelEvent } from "../../hooks/useCancelEvent"; */
import { useEventReject } from "../../hooks/useEventReject";
import { useEventCancel } from "../../hooks/useEventCancel";
import { AdminEventDTO } from "../../types";
import { useEventById } from "../../hooks/useEventByID";
import { useApproveEvent } from "../../hooks/useApproveEvent";
import SectionAIBox from "@/components/shared/drawer/SectionAIBox";
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

  /* veriyi getiren kurye */
  const { data: response, isLoading } = useEventById(eventId);
  console.log(response);
  const eventData = response?.event as AdminEventDTO;

  console.log(eventData);

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
      <DrawerContent className="h-full max-w-none w-[min(30rem,75vw)] rounded-r-none rounded-l-xl [--drawer-inset:0px]">
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
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex flex-col gap-8 flex-1 overflow-y-auto px-6 py-6">
              <SectionShell title="Etkinlik Bilgileri">
                {isLoading ? (
                  <div className="p-4 text-sm text-yellow-600 animate-pulse">
                    Veriler Çekiliyor...
                  </div>
                ) : (
                  <>
                    <InfoSection label="Durum">
                      <span className="capitalize font-medium text-blue-600">
                        {eventData?.status || "Belirtilmemiş"}
                      </span>
                    </InfoSection>

                    <InfoSection label="Kategori">
                      {typeof eventData?.categoryId === "object"
                        ? eventData.categoryId?.name || "Belirtilmemiş"
                        : eventData?.categoryId || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Yaş Aralıgı">
                      {eventData?.ageRange || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Acıklama">
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

                    <InfoSection label="Ucretli/Ucretsiz">
                      <span className="capitalize font-medium text-(--brown-500)">
                        {eventData?.isFree || "Belirtilmemiş"}
                      </span>
                    </InfoSection>

                    <InfoSection label="Ücret">
                      {eventData?.price?.amount || "Belirtilmemiş"}
                    </InfoSection>

                    <InfoSection label="Olusturan">
                      <span className="capitalize font-medium text-(--brown-500)">
                        {typeof eventData?.createdBy === "object"
                          ? eventData.createdBy?.username
                          : eventData?.createdBy}
                      </span>
                    </InfoSection>
                  </>
                )}
              </SectionShell>

              <SectionAIBox />

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading text-terracotta-600">
                        İşlem Notu / Red & İptal Sebebi
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Red veya İptal ediyorsanız sebebini yazmak zorunludur."
                          className="focus-visible:ring-0 bg-sidebar border-none resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DrawerFooter className="bg-sidebar flex-row items-center justify-between border-t px-6 py-4">
              <DrawerClose
                render={
                  <Button type="button" variant="ghost">
                    Vazgeç
                  </Button>
                }
              />

              <div className="flex flex-row gap-2">
                {eventData?.status === "pending" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isApproving ? "Onaylanıyor..." : "Onayla"}
                  </Button>
                )}

                {eventData?.status === "pending" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isRejecting ? "Reddediliyor..." : "Reddet"}
                  </Button>
                )}

                {eventData?.status === "approved" && (
                  <Button
                    disabled={isWorking}
                    type="submit"
                    onClick={() => form.setValue("status", "cancelled")}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
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

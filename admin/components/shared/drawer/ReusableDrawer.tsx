"use client";

import ReusableDrawerHeader from "@/components/shared/drawer/ReusableDraweHeader";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import SectionShell from "./SectionShell";
import InfoSection from "./InfoSection";
import { z } from "zod";
import { reviewApplicationSchema } from "@/features/validations/ReviewApplicationForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOrganızarApplicationById } from "@/features/organizer-applications/hooks/useOrganizerApplicationById";
import SectionAIBox from "./SectionAIBox";
import { useApproveApplication } from "@/features/organizer-applications/hooks/useApproveApplication";
import { useRejectApplication } from "@/features/organizer-applications/hooks/useRejectApplication";

type ReviewFormValues = z.infer<typeof reviewApplicationSchema>;

const reviewFormDefaults = {
  status: undefined,
  note: "",
} as unknown as ReviewFormValues;

export default function ReusableDrawer() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const cardId = params.get("applicationId");
  const isOpen = Boolean(cardId);

  const { data: response, isLoading } = useOrganızarApplicationById(cardId);
  const appData = response?.application;
  /* onaylama kamyonum */
  const { mutate: approveApplication, isPending: isApproving } =
    useApproveApplication();

  /* reddetme kamyonum */
  const { mutate: rejectApplication, isPending: isRejecting } =
    useRejectApplication();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewApplicationSchema),
    defaultValues: reviewFormDefaults,
  });

  function onSubmit(data: ReviewFormValues) {
    
    if (!cardId) return;
    if (data.status === "approved") {
      approveApplication(cardId, {
        onSuccess: () => {
          /* basarılı olduysa drawerı kapa */
          handleDrawerClose(false);
        },
      });
    } else if (data.status === "rejected") {
      rejectApplication(
        { id: cardId, body: { rejectedReason: data.note } },
        {
          onSuccess: () => {
            handleDrawerClose(false);
          },
        },
      );
    }
  }

  function handleDrawerClose(open: boolean) {
    if (!open) {
      const currentParams = new URLSearchParams(params.toString());
      currentParams.delete("applicationId");

      const query = currentParams.toString();
      const newUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(newUrl);
      form.reset(reviewFormDefaults);
    }
  }
  const formatted = appData?.createdAt
    ? new Date(appData.createdAt).toLocaleString("en-EN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleDrawerClose}
      swipeDirection="right"
    >
      <DrawerContent>
        <ReusableDrawerHeader
          title="Bewerbungsdetails"
          tag={appData?.institutionData?.name ?? "Neue Bewerbungsdetails"}
          subtitle={formatted ? `Verwaltung · ${formatted}` : "Verwaltung"}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex flex-col gap-8  flex-1 overflow-y-auto px-6 py-6">
              <SectionShell title="Kurum bilgisi" columns={2}>
                {isLoading ? (
                  <div className="p-4 text-sm text-primary">
                    Wird geladen...
                  </div>
                ) : (
                  <>
                    <InfoSection label="Kategori">
                      {appData?.institutionData?.category || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Açıklama" wide>
                      {appData?.institutionData?.description || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Adres" wide>
                      {appData?.institutionData?.address || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Web Sitesi">
                      {appData?.institutionData?.website || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Durum">
                      <span className="capitalize">
                        {appData?.status || "Belirtilmemiş"}
                      </span>
                    </InfoSection>
                    <InfoSection label="Asignee">
                      {appData?.reviewedBy || "Belirtilmemiş"}
                    </InfoSection>
                  </>
                )}
              </SectionShell>

              <SectionAIBox aiAnalysis={appData?.aiAnalysis} />

              <div className="flex flex-col gap-3">
                <h2 className="font-heading uppercase text-xs text-primary">
                  Basvuru Mesajı
                </h2>
                <div className="pl-4 flex flex-col gap-2 rounded-l border-l-2 border-l-primary bg-muted p-2">
                  <p className="font-body text-xs leading-7 italic">
                    {appData?.message ||
                      "Bei der Bewerbung wurde keine besondere Nachricht übermittelt."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading text-primary">
                        Ablehnungsgrund (erforderlich)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="İşlemi neden reddettiğini yaz"
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

            <DrawerFooter className="bg-sidebar flex-row items-center justify-between border-t px-6 py-4">
              <DrawerClose
                render={
                  <Button type="button" variant="ghost">
                    Abbrechen
                  </Button>
                }
              />
              <div className="flex flex-row flex-wrap gap-2">
                <Button
                  disabled={isApproving}
                  type="submit"
                  onClick={() => form.setValue("status", "approved")}
                >
                  {isApproving ? "Wird genehmigt..." : "Genehmigen"}
                </Button>
                <Button
                 disabled={isRejecting}
                  type="submit"
                  onClick={() => form.setValue("status", "rejected")}
                  className="bg-muted text-foreground hover:bg-muted/80"
                >
                {isRejecting ? "Reject Ediliyor..." : "Reject"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

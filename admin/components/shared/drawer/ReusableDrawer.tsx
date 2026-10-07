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
import { APPLICATION_STATUS_LABELS } from "@/features/organizer-applications/types/organizerApplications";

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
  console.log("cardid geldimi",cardId)
  const isOpen = Boolean(cardId);
  console.log(isOpen,"kontrol et isopen kısmını cekmece acılmalı ")

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

console.log("zod hatası almalıym bossa rejected kısmım")
  function onSubmit(data: ReviewFormValues) {
    
    /*  console.log(data); */
    if (!cardId) return;
    if (data.status === "approved") {
      console.log("onay kamyonu yola cıktımı id:" ,cardId)
      approveApplication(cardId, {
        onSuccess: () => {
          /* basarılı olduysa drawerı kapa */
          console.log("islm basarılımı cekmece kapanıyormu")
          handleDrawerClose(false);
        },
      });
    } else if (data.status === "rejected") {
      console.log("reject kamyonum yola cıktı  Sebebi ve id ",data.note,cardId )
      rejectApplication(
        { id: cardId, body: { rejectedReason: data.note } },
        {
          onSuccess: () => {
            console.log("cekmece kapanıyrmu ıslem tamam")
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
    ? new Date(appData.createdAt).toLocaleString("de-DE", {
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
          title="Antragsdetails"
          tag={appData?.institutionData?.name ?? "Neuer Antrag"}
          subtitle={formatted ? `Betrieb · ${formatted}` : "Betrieb"}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex flex-col gap-8  flex-1 overflow-y-auto px-6 py-6">
              <SectionShell title="Angaben zur Einrichtung" columns={2}>
                {isLoading ? (
                  <div className="p-4 text-sm text-primary">
                    Wird geladen...
                  </div>
                ) : (
                  <>
                    <InfoSection label="Kategorie">
                      {appData?.institutionData?.category || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Beschreibung" wide>
                      {appData?.institutionData?.description || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Adresse" wide>
                      {appData?.institutionData?.address || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Website">
                      {appData?.institutionData?.website || "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Status">
                      {appData?.status
                        ? APPLICATION_STATUS_LABELS[appData.status]
                        : "Nicht angegeben"}
                    </InfoSection>
                    <InfoSection label="Zuständig">
                      {appData?.reviewedBy || "Nicht angegeben"}
                    </InfoSection>
                  </>
                )}
              </SectionShell>

              <SectionAIBox />

              <div className="flex flex-col gap-3">
                <h2 className="font-heading uppercase text-xs text-primary">
                  Antragsnachricht
                </h2>
                <div className="pl-4 flex flex-col gap-2 rounded-l border-l-2 border-l-primary bg-muted p-2">
                  <p className="font-body text-xs leading-7 italic">
                    {appData?.message ||
                      "Beim Antrag wurde keine Nachricht hinterlassen."}
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
                        Ablehnungsgrund (Pflichtfeld)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beschreibe, warum du den Antrag ablehnst"
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
                {isRejecting ? "Wird abgelehnt..." : "Ablehnen"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

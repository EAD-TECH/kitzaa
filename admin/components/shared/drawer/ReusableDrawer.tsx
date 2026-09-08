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
import { useOrganızarApplicationById } from "@/features/admin/hooks/useOrganızerApplicationById";
import SectionAIBox from "./SectionAIBox";
import { useApproveApplication } from "@/features/admin/hooks/useApproveApplication";
import { useRejectApplication } from "@/features/admin/hooks/useRejectApplication";

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
    /* TODO: review kararını backend'e gönder */
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
    ? new Date(appData.createdAt).toLocaleString("tr-TR", {
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
      <DrawerContent className="h-full max-w-none w-[min(30rem,75vw)] rounded-r-none rounded-l-xl [--drawer-inset:0px]">
        <ReusableDrawerHeader
          title="Başvuru Detayı"
          tag={appData?.institutionData?.name ?? "Yeni Başvuru Detayı"}
          subtitle={formatted ? `Operasyon · ${formatted}` : "Operasyon"}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex flex-col gap-8  flex-1 overflow-y-auto px-6 py-6">
              <SectionShell title="Kurum bilgisi">
                {isLoading ? (
                  <div className="p-4 text-sm text-(--terracotta-500)">
                    Yükleniyor...
                  </div>
                ) : (
                  <>
                    <InfoSection label="Kategori">
                      {appData?.institutionData?.category || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Açıklama">
                      {appData?.institutionData?.description || "Belirtilmemiş"}
                    </InfoSection>
                    <InfoSection label="Adres">
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

              <SectionAIBox />

              <div className="flex flex-col gap-3">
                <h2 className="font-heading uppercase text-xs text-(--terracotta-600)">
                  Basvuru Mesajı
                </h2>
                <div className="pl-4 flex flex-col gap-2 rounded-l border-l-2 border-l-(--terracotta-600) bg-(--cream-200) p-2">
                  <p className="font-body text-xs leading-7 italic">
                    {appData?.message ||
                      "Başvuru sırasında özel bir mesaj iletilmemiş."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading text-terracotta-600">
                        Reddetme Sebebi (Zorunlu)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="İşlemi neden reddettiğini yaz"
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
              <div className="flex flex-row gap-2 bg-brown-500 hover:bg-brown-600">
                <Button
                  disabled={isApproving}
                  type="submit"
                  onClick={() => form.setValue("status", "approved")}
                >
                  {isApproving ? "Onaylanıyor..." : "Onayla"}
                </Button>
                <Button
                 disabled={isRejecting}
                  type="submit"
                  onClick={() => form.setValue("status", "rejected")}
                  className="bg-(--cream-200) text-(--brown-500) hover:text-(--cream-50)"
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

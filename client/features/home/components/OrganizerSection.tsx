"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAuthStore } from "@/features/auth/store/authStore";

export function OrganizerSection() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const isReady = useAuthStore((state) => state.isReady);

  const handleClick = () => {
    if (!isReady) return;

    if (!currentUser) {
      toast(t("organizerLoginPrompt"));
      return;
    }

    router.push("/profile");
  };

  return (
    <section className="px-6 pb-14 tablet:px-10 tablet:pb-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border bg-surface-accent text-foreground">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full desktop:w-[58%]">
          <Image
            src="/images/herbst-basteln.png"
            alt={t("organizerImageAlt")}
            fill
            sizes="(min-width: 64rem) 45vw, 100vw"
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-accent from-25% via-surface-accent/90 via-50% to-transparent" />
        </div>

        <div className="relative max-w-xl px-6 py-8 tablet:px-10 tablet:py-12 desktop:py-14">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground">
              K
            </span>
            <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
              {t("organizerEyebrow")}
            </p>
          </div>

          <h2 className="mt-5 font-heading text-3xl font-semibold text-balance tablet:text-4xl">
            {t("organizerTitle")}
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground tablet:text-base">
            {t("organizerSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button type="button" className="rounded-full px-5" onClick={handleClick}>
              {t("organizerCta")}
            </Button>
            <p className="text-sm text-muted-foreground">{t("organizerNote")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

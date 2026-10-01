import Image from "next/image";
import { Sprout } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export async function HeroSection() {
  const t = await getTranslations("HomePage");

  return (
    <section className="relative isolate aspect-3/4 overflow-hidden tablet:aspect-4/3 desktop:aspect-1556/688">
      <Image
        src="/images/heroImage.jpg"
        alt={t("heroImageAlt")}
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
      />

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 block h-8 w-full tablet:h-12"
      >
        <path
          d="M0,60 C120,90 240,90 360,60 C480,30 600,30 720,60 C840,90 960,90 1080,60 C1200,30 1320,30 1440,60 L1440,120 L0,120 Z"
          className="fill-surface-accent"
        />
      </svg>

      <div className="relative flex h-full items-start justify-center px-4 pt-28 text-center tablet:px-20 tablet:pt-30 desktop:px-10 desktop:pt-34">
        <div className="animate-fade-in-up flex max-w-xl flex-col items-center gap-3 tablet:gap-5">
          <Badge className="h-auto gap-1.5 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
            <Sprout className="size-3.5" />
            {t("title")}
          </Badge>
          <h1 className="font-heading text-xl font-semibold text-balance tablet:text-3xl desktop:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground tablet:max-w-md tablet:text-base">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full"
              nativeButton={false}
              render={<Link href="/events" />}
            >
              {t("discoverEvents")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

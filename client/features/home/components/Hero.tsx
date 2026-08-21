import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export async function HeroSection() {
  const t = await getTranslations("HomePage");

  return (
    <section className="relative isolate min-h-128 overflow-hidden desktop:min-h-144">
      <Image
        src="/images/image-canli.png"
        alt={t("heroImageAlt")}
        fill
        className="object-cover object-[70%_center]"
        priority
        sizes="100vw"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-background from-5% via-background/30 to-background/20 desktop:from-5% desktop:via-background/30 desktop:to-transparent"
      />

      <div className="relative flex min-h-128 items-center px-6 py-16 tablet:px-20 desktop:min-h-144 desktop:px-10">
        <div className="flex max-w-xl flex-col items-start gap-5">
          <Badge className="h-auto rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
            {t("title")}
          </Badge>
          <h1 className="font-heading text-3xl font-semibold text-balance tablet:text-4xl desktop:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="text-base text-muted-foreground tablet:text-lg">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full"
              nativeButton={false}
              render={<Link href="/events" />}
            >
              {t("discoverEvents")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-background/80"
              nativeButton={false}
              render={<Link href="#home-featured" />}
            >
              {t("learnMore")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

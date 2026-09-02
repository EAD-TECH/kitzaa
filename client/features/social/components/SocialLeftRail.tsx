"use client";

import { Camera, Images, MapPin } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useTranslations } from "next-intl";
import backgroundPattern from "../../../public/images/event-pattern.png";

interface SocialLeftRailProps {
  children?: React.ReactNode;
}

function SocialLeftRail({ children }: SocialLeftRailProps) {
  const t = useTranslations("Social");
  const { data: currentUser } = useCurrentUser();
  const fullName = currentUser
    ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ")
    : "";
  const displayName = fullName || currentUser?.username || "";
  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}` ||
      currentUser.username.slice(0, 2)
    : "";
  const roleLabel = currentUser
    ? {
        user: t("roleFamily"),
        organizer: t("roleOrganizer"),
        admin: t("roleAdmin"),
      }[currentUser.role]
    : null;

  return (
    <div className="flex flex-col gap-4">
      {currentUser ? (
        <section className="hidden rounded-2xl border bg-card p-5 shadow-sm desktop:block">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={displayName} />
              ) : null}
              <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-semibold">{displayName}</p>
              <p className="truncate text-sm text-muted-foreground">@{currentUser.username}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            {currentUser.location?.city ? (
              <>
                <MapPin className="size-3.5" />
                <span className="truncate">{currentUser.location.city}</span>
              </>
            ) : null}
            {roleLabel ? <Badge variant="secondary">{roleLabel}</Badge> : null}
          </div>
        </section>
      ) : null}

      {children}

      <section className="relative isolate hidden overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm desktop:block">
        <Image
          src={backgroundPattern}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-8 -z-10 w-44 opacity-20 invert"
        />

        <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15">
          <Camera className="size-5" />
        </div>

        <p className="mt-3 font-heading text-xl font-semibold">{t("shareTitle")}</p>
        <p className="mt-2 text-sm text-primary-foreground/85">{t("shareBody")}</p>

        <p className="mt-4 flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-2 text-sm text-primary-foreground/80">
          <Images className="size-4 shrink-0" />
          <span className="truncate">{t("sharePrompt")}</span>
        </p>
      </section>
    </div>
  );
}

export default SocialLeftRail;

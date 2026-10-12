"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CircleCheck, Clock, PencilSparkles, Plus, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import { useMyOrganizerApplications } from "../hooks/organizerHook";
import type { ApplicationStatus } from "../types/organizerApplication.types";
import OrganizerApplicationForm from "./OrganizerApplicationForm";
import { InstitutionCard } from "@/features/institution/components/InstitutionCard";
import { InstitutionForm } from "@/features/institution/components/InstitutionForm";
import { useMyInstitution } from "@/features/institution/hooks/useInstitution";

const ACTIVE_STATUSES: ApplicationStatus[] = ["pending", "under_review", "needs_more_info"];

const OrganizerApplicationCard = () => {
  const t = useTranslations("OrganizerApplication");
  const { data: user } = useCurrentUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInstitutionFormOpen, setIsInstittionFormOpen] = useState(false);
  const { data: applicationsResponse, isLoading } = useMyOrganizerApplications(
    Boolean(user) && (user?.role === "user" || user?.role === "organizer"),
  );
  const { data: institutionResponse } = useMyInstitution();
  const institution = institutionResponse?.institution;

  if (!user) return null;

  const latestApplication = applicationsResponse?.applications[0];
  const isActiveApplication = latestApplication != null && ACTIVE_STATUSES.includes(latestApplication.status);
  const isRejected = latestApplication?.status === "rejected";

  const approvedApplication = applicationsResponse?.applications.find(
    (application) => application.status === "approved",
  );
  const institutionName = institution?.name
    ?? approvedApplication?.institutionData.name
    ?? latestApplication?.institutionData.name;
  const canEditInstitution = user.role === "organizer" && Boolean(institution);

  const closeForm = () => setIsFormOpen(false);

  let body: ReactNode;
  let action: ReactNode = null;

  if (user.role === "organizer" || latestApplication?.status === "approved") {
    body = (
      <div>
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm leading-normal text-muted-foreground">
              {institutionName
                ? t("approvedFor", { name: institutionName })
                : t("alreadyOrganizer")}
            </p>
            <p className="text-xs text-muted-foreground/80">
              {t("canOfferEvents")}
            </p>
          </div>
          {canEditInstitution && !isInstitutionFormOpen ? (
            <Button type="button" onClick={() => setIsInstittionFormOpen(true)}>
              <PencilSparkles />
              {t("edit")}
            </Button>
          ) : null}
        </div>

        {user.role === "organizer" && !isInstitutionFormOpen ? (
          <InstitutionCard institution={institution} />
        ) : null}
        {isInstitutionFormOpen && institution ? (
          <>
            <Separator className="my-6 h-px w-full bg-foreground/10" />
            <InstitutionForm institution={institution} onCancel={() => setIsInstittionFormOpen(false)} />
          </>
        ) : null}
      </div>
    );
    action = (
      <Button
        render={<Link href="/profile/events-erstellen" />}
        nativeButton={false}
        size="sm"
        className="w-full shrink-0 tablet:w-auto"
      >
        <Plus className="size-4" />
        {t("createEvent")}
      </Button>
    );
  } else if (user.role === "admin") {
    body = <p className="text-sm leading-normal text-muted-foreground">{t("youAreAdmin")}</p>;
  } else if (!user.isEmailVerified) {
    body = (
      <p className="text-sm leading-normal text-muted-foreground">
        {t("verifyEmail")}
      </p>
    );
  } else if (isLoading) {
    body = <p className="text-sm leading-normal text-muted-foreground">{t("loading")}</p>;
  } else if (isActiveApplication && latestApplication) {
    body = (
      <div className="space-y-1">
        <p className="text-sm leading-normal text-muted-foreground">
          {t("inReview", { name: latestApplication.institutionData.name })}
        </p>
        <p className="text-xs text-muted-foreground/80">{t("reviewTime")}</p>
      </div>
    );
    action = (
      <Badge
        variant="outline"
        className="h-8 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 text-xs font-medium text-primary"
      >
        <Clock className="size-3.5" />
        {t("inReviewBadge")}
      </Badge>
    );
  } else if (isRejected && latestApplication && !isFormOpen) {
    body = (
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{t("rejected")}</p>
        {latestApplication.rejectedReason ? (
          <p className="text-sm leading-normal text-muted-foreground">{latestApplication.rejectedReason}</p>
        ) : null}
      </div>
    );
    action = (
      <Button size="sm" className="w-full shrink-0 tablet:w-auto" onClick={() => setIsFormOpen(true)}>
        {t("applyAgain")}
      </Button>
    );
  } else if (isFormOpen) {
    body = <OrganizerApplicationForm onCancel={closeForm} />;
    action = (
      <Button
        size="sm"
        className="w-full shrink-0 tablet:w-auto"
        onClick={closeForm}
        aria-label={t("closeForm")}
      >
        <X />
      </Button>
    );
  } else {
    body = (
      <div className="space-y-3">
        <p className="text-sm leading-normal text-muted-foreground">
          {t("intro")}
        </p>
        <p className="text-xs text-muted-foreground/80">{t("reviewTime")}</p>
      </div>
    );
    action = (
      <Button size="sm" className="w-full shrink-0 tablet:w-auto" onClick={() => setIsFormOpen(true)}>
        {t("apply")}
      </Button>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 tablet:p-8">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex items-center gap-2.5">
          <User className="size-5 shrink-0 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">{t("title")}</h2>
          {(user.role === "organizer" || latestApplication?.status === "approved") && (
            <Badge variant="secondary" className="h-6 gap-1 rounded-full px-2 text-[11px] font-medium">
              <CircleCheck className="size-3" />
              {t("organizer")}
            </Badge>
          )}
        </div>
        {action}
      </div>
      <Separator className="my-6" />
      {body}
    </div>
  );
};

export default OrganizerApplicationCard;

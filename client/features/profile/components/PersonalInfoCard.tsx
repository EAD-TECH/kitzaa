"use client";

import { useState } from "react";
import { PencilSparkles, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { AuthUser } from "@/features/auth/types/authTypes";
import UpdatePersonalInfoForm from "./UpdatePersonalInfoForm";

function formatAddress(location: AuthUser["location"]) {
  const place = [location.zipCode, location.district].filter(Boolean).join(" ");
  return [place, location.state].filter(Boolean).join(", ") || "—";
}

const PersonalInfoCard = () => {
  const { data: user } = useCurrentUser();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 tablet:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <User className="size-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">Persönliche Informationen</h2>
        </div>
        {!isFormOpen ? (
          <Button type="button" onClick={() => setIsFormOpen(true)}>
            <PencilSparkles />
            Bearbeiten
          </Button>
        ) : null}
      </div>

      <Separator className="my-6" />

      {isFormOpen ? (
        <UpdatePersonalInfoForm onCancel={() => setIsFormOpen(false)} />
      ) : (
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">E-Mail</p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-foreground">{user.email}</p>
              <Badge variant="secondary" className="h-6 rounded-full px-2 text-[11px] font-medium">
                {user.isEmailVerified ? "Verifiziert" : "Nicht verifiziert"}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Adresse</p>
            <p className="text-sm text-foreground">{formatAddress(user.location)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoCard;

import { Globe, MapPin, Phone } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import type { Institution } from "../types/institution.types";

type InstitutionCardProps = {
  institution?: Institution;
};

export const InstitutionCard = ({ institution }: InstitutionCardProps) => {
  const items = [
    { icon: Phone, label: "Telefon", value: institution?.phone || "—" },
    { icon: Globe, label: "Website", value: institution?.website || "—" },
    { icon: MapPin, label: "Adresse", value: institution?.address || "—" },
  ] as const;

  return (
    <div>
      <div className="mt-6 flex flex-col gap-1">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {institution?.name || "—"}
        </h3>
        {institution?.description ? (
          <p className="text-sm text-muted-foreground">{institution.description}</p>
        ) : null}
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-4 shrink-0 text-primary" />
            <div className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="text-sm text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

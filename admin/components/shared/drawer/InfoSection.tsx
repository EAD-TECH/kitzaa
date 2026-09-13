import Link from "next/link";
import type { InfoSectionProps } from "../types";
import { Label } from "@/components/ui/label";


export default function InfoSection({ label, children }: InfoSectionProps) {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <Label className="font-heading font-normal text-xs text-muted-foreground uppercase">
          {label}
        </Label>
        <div className="text-brown-500 text-xs font-body leading-6 font-normal">
          {children}
        </div>
      </div>
    </div>
  );
}

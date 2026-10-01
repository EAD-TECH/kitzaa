import type { InfoSectionProps } from "../types";
import { Label } from "@/components/ui/label";

export default function InfoSection({
  label,
  children,
  wide = false,
}: InfoSectionProps) {
  return (
    <div className={wide ? "col-span-2 min-w-0" : "min-w-0"}>
      <div className="flex flex-col gap-1">
        <Label className="font-heading font-normal wrap-break-word text-xs text-muted-foreground uppercase">
          {label}
        </Label>
        <div className="text-foreground wrap-break-word text-xs font-body leading-6 font-normal">
          {children}
        </div>
      </div>
    </div>
  );
}

import { time } from "console";
import type { PageHeaderProps } from "./types";

export default function PageHeader({
  title,
  description,
  actionButton,
  dateText,
  machineDate
}: PageHeaderProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch tablet:flex-row tablet:items-start tablet:justify-between gap-2 ">
      <div className="flex flex-col  justify-between gap-2">
        {dateText && (
          <time dateTime={machineDate} className="font-heading text-sm font-normal tracking-wider uppercase text-muted-foreground">{dateText}</time>
        )}
        <h1 className="font-heading text-xl sm:tex-sm font-normal leading-8 text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="font-heading text-sm  font-normal tracking-wider uppercase text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actionButton}
    </div>
  );
}

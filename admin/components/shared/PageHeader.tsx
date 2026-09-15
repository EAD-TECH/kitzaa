import type { PageHeaderProps } from "./types";

export default function PageHeader({
  title,
  description,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="flex w-full items-start justify-between gap-2 ">
      <div className="flex flex-col  justify-between gap-2">
        {description ? (
          <p className="font-heading text-sm font-normal tracking-wider uppercase text-muted-foreground">
            {description}
          </p>
        ) : null}
        <h1 className="font-heading text-xl sm:tex-sm font-normal leading-8 text-foreground">
          {title}
        </h1>
      </div>
      {actionButton}
    </div>
  );
}

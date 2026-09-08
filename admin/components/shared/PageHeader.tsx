import type { PageHeaderProps } from "./types";

export default function PageHeader({
  title,
  description,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-2">
        {description ? (
          <p className="font-heading text-sm font-normal tracking-wider uppercase text-(--brown-500) dark:text-accent-foreground">
            {description}
          </p>
        ) : null}
        <h1 className="font-heading text-xl font-normal leading-8 text-(--brown-500) dark:text-accent-foreground">
          {title}
        </h1>
      </div>
      {actionButton}
    </div>
  );
}

import type { SectionShellProps } from "../types";

export default function SectionShell({
  title,
  children,
  columns = 1,
}: SectionShellProps) {
  return (
    <section className="  rounded-xl border border-kanban-card-bg flex flex-col gap-4">
      <h2 className="font-heading text-xs uppercase tracking-wider text-primary">
        {title} {/* Kurum Bilgisi */}
      </h2>

      {/* burda ıcıne gelen her bılesenı basıcak*/}
      <div
        className={
          columns === 2
            ? "grid min-w-0 grid-cols-2 gap-x-6 gap-y-5"
            : "flex flex-col gap-5"
        }
      >
        {children}
      </div>
    </section>
  );
}

import type { SectionShellProps } from "../types";

export default function SectionShell({ title, children }: SectionShellProps) {
  return (
    <section className="  rounded-xl border border-kanban-card-bg flex flex-col gap-4">
      <h2 className="font-heading text-xs uppercase tracking-wider text-(--terracotta-600)">
        {title} {/* Kurum Bilgisi */}
      </h2>

      {/* burda ıcıne gelen her bılesenı basıcak*/}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">{children}</div>
    </section>
  );
}

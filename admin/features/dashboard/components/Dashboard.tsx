import PageHeader from "@/components/shared/PageHeader";

import AdminLiveWidget from "../live-widget/components/AdminLiveWidget";

export default function Dashboard() {
  const today = new Date();
  const humanReadable = today.toLocaleDateString("en-EN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const machineReadable = today.toISOString().split("T")[0];
  return (
    <main className="flex flex-col gap-6 px-4 md:gap-8 md:px-6">
      <section>
        <PageHeader
          title="Operasyon Dashboard'u"
          description="Bugünün başvurularını, etkinlik yoğunluğunu ve ekip aksiyonlarını tek bakışta yönetin."
          dateText={humanReadable}
          machineDate={machineReadable}
        />
      </section>

      {/* Stats kartları bu alanı dolduracak */}
      <section className="mt-6 grid min-h-80 grid-cols-3 gap-4 border-2 border-border tablet:grid-cols-2" />

      {/* Canli akıs kısmı */}
      <section className="grid grid-cols-1 tablet:grid-cols-3">
        {/* canlı akıs */}
        <div className="col-span-1 flex h-112 min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card p-0 shadow-kanban-card tablet:col-span-3">
          <AdminLiveWidget />
        </div>
      </section>
    </main>
  );
}

"use client";

import { getAdminEvent } from "@/features/events/api";
import { useParams } from "next/navigation";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const onTest = async () => {
    try {
      const data = await getAdminEvent(id);
      console.log("admin event", data);
      alert("OK – siehe Konsole");
    } catch (e) {
      console.error(e);
      alert("Fehlgeschlagen – siehe Konsole");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Event-Details</h1>
      <p className="text-sm">ID: {id}</p>
      <button
        type="button"
        className="rounded border px-3 py-2"
        onClick={onTest}
      >
        getAdminEvent testen
      </button>
    </main>
  );
}

"use client";

import { useParams } from "next/navigation";
import { getAdminEvent } from "@/features/admin/api";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const onTest = async () => {
    try {
      const data = await getAdminEvent(id);
      console.log("admin event", data);
      alert("OK — check Console");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Event detail</h1>
      <p className="text-sm">id: {id}</p>
      <button type="button" className="rounded border px-3 py-2" onClick={onTest}>
        Test getAdminEvent
      </button>
    </main>
  );
}

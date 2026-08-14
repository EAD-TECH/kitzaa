"use client";

import Link from "next/link";
import { listAdminEvents } from "@/features/admin/api";

export default function EventsPage() {
  const onTest = async () => {
    try {
      const data = await listAdminEvents();
      console.log("admin events", data);
      alert("OK — check Console (copy an event _id for detail test)");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Admin events</h1>
      <button type="button" className="rounded border px-3 py-2" onClick={onTest}>
        Test listAdminEvents
      </button>
      <p className="text-sm text-muted-foreground">
        Detail:{" "}
        <Link className="underline" href="/admin/events/REPLACE_WITH_ID">
          /admin/events/[id]
        </Link>
      </p>
    </main>
  );
}

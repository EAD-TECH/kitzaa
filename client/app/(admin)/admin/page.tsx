"use client";

import Link from "next/link";
import {
  listAdminEvents,
  listOrganizerApplications,
} from "@/features/admin/api";

export default function AdminPage() {
  const testApplications = async () => {
    try {
      const data = await listOrganizerApplications();
      console.log("organizer applications", data);
      alert("OK — check Console for organizer applications");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  const testEvents = async () => {
    try {
      const data = await listAdminEvents();
      console.log("admin events", data);
      alert("OK — check Console for events");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Admin API stub test</h1>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={testApplications}
        >
          Test list organizer applications
        </button>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={testEvents}
        >
          Test list admin events
        </button>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>
          <Link className="underline" href="/admin/organizer-applications">
            /admin/organizer-applications
          </Link>
        </li>
        <li>
          <Link className="underline" href="/admin/events">
            /admin/events
          </Link>
        </li>
      </ul>
    </main>
  );
}

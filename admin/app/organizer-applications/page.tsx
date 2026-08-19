"use client";

import { listOrganizerApplications } from "@/features/admin/api";

export default function OrganizerApplicationsPage() {
  const onTest = async () => {
    try {
      const data = await listOrganizerApplications();
      console.log("organizer applications", data);
      alert("OK — check Console");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Organizer applications</h1>
      <button type="button" className="rounded border px-3 py-2" onClick={onTest}>
        Test listOrganizerApplications
      </button>
    </main>
  );
}

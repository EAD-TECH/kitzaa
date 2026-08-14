"use client";

import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsAsRead,
} from "@/features/notifications/api";

export default function NotificationsTestPage() {
  const testList = async () => {
    try {
      const data = await listNotifications();
      console.log("notifications", data);
      alert("OK — check Console");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  const testUnread = async () => {
    try {
      const data = await getUnreadNotificationCount();
      console.log("unread count", data);
      alert("OK — check Console");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  const testMarkAll = async () => {
    try {
      const data = await markAllNotificationsAsRead();
      console.log("mark all read", data);
      alert("OK — check Console");
    } catch (e) {
      console.error(e);
      alert("Failed — check Console");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Notifications API stub test</h1>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded border px-3 py-2" onClick={testList}>
          Test listNotifications
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={testUnread}>
          Test unread-count
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={testMarkAll}>
          Test mark-all-read
        </button>
      </div>
    </main>
  );
}
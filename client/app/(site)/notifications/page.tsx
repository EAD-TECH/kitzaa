"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const pageShell = "mx-auto max-w-2xl px-4 py-8";

function formatNotificationTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const { data, isPending, isError } = useNotifications();

  const notifications = Array.isArray(data?.result) ? data.result : [];

  if (isPending)
    return (
      <div className={pageShell} role="status" aria-busy="true">
        <span className="sr-only">Yükleniyor...</span>
        <h1 className="font-heading mb-6 text-2xl">Bildirimler</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className={pageShell}>
        <h1 className="font-heading mb-6 text-2xl">Bildirimler</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            Bildirimler yüklenemedi. Lütfen daha sonra tekrar deneyin.
          </AlertDescription>
        </Alert>
      </div>
    );

  if (!notifications.length)
    return (
      <div className={pageShell}>
        <h1 className="font-heading mb-6 text-2xl">Bildirimler</h1>
        <p className="font-body text-center text-sm text-muted-foreground">
          Bildirim yok.
        </p>
      </div>
    );

  return (
    <div className={pageShell}>
      <h1 className="font-heading mb-6 text-2xl">Bildirimler</h1>
      <ul className="space-y-2">
        {notifications.map((not) => (
          <li
            key={not._id}
            className={cn(
              "flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50",
              not.isRead
                ? "bg-card"
                : "border-l-2 border-l-primary bg-primary/5",
            )}
          >
            <Avatar className="mt-0.5 shrink-0">
              {not.sender?.avatarUrl ? (
                <AvatarImage
                  src={not.sender.avatarUrl}
                  alt={not.sender.firstName ?? ""}
                />
              ) : null}
              <AvatarFallback>
                {not.sender?.firstName?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-heading text-sm",
                  !not.isRead && "font-medium",
                )}
              >
                {not.title}
              </p>
              <p className="font-body mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                {not.message}
              </p>
            </div>
            <time
              className="shrink-0 text-xs text-muted-foreground"
              dateTime={not.createdAt}
              suppressHydrationWarning
            >
              {formatNotificationTime(not.createdAt)}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
}
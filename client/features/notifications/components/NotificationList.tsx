"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function NotificationList() {
  const { data, isPending, isError } = useNotifications();

  const notifications = Array.isArray(data?.result) ? data.result : [];

  if (isPending)
    return (
      <div className={`${pageShell} flex min-h-[60vh] flex-col justify-center`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="size-4 shrink-0 rounded-sm" />
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            {i < 3 ? <Separator /> : null}
          </div>
        ))}
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
      <ul className="overflow-hidden rounded-xl border border-border bg-background">
        <li>
          <div className="flex items-center gap-3 bg-amber-200 px-3 py-2">
            <Checkbox
              className="shrink-0 rounded-sm"
              disabled
              aria-hidden
            ></Checkbox>
          </div>
          <Separator />
        </li>

        {notifications.map((not, i) => (
          <li key={not._id}>
            <div
              className={cn(
                "flex items-center  gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50",
                !not.isRead && "border-l-2 border-l-primary",
              )}
            >
              <Checkbox className="shrink-0 rounded-sm"></Checkbox>

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
            </div>

            {i < notifications.length - 1 ? <Separator /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

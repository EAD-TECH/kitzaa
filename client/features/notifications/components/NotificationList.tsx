"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadMoreButton } from "@/components/shared/LoadMoreButton";
import { useRouter } from "@/i18n/navigation";
import { useMarkNotificationRead } from "@/features/notifications/hooks/useMarkNotificationRead";
import type { NotificationDTO } from "@/features/notifications/types";

const pageShell = "mx-auto max-w-2xl px-4 py-8";

/* bunu bıryere bagladm daha */

function formatNotificationTime(createdAt: string, locale: string) {

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNotificationHref(not: NotificationDTO) {
  const link = not.linkNotification?.trim();
  if (!link) return null;
  return link.startsWith("/") ? link : `/${link}`;
}

export default function NotificationList() {
  const t = useTranslations("Notifications");
  const common = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { notifications, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useNotifications();

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
        <h1 className="font-heading mb-6 text-2xl">{t("title")}</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{common("error")}</AlertTitle>
          <AlertDescription>
            {t("loadFailed")}
          </AlertDescription>
        </Alert>
      </div>
    );

  if (!notifications.length)
    return (
      <div className={pageShell}>
        <h1 className="font-heading mb-6 text-2xl">{t("title")}</h1>
        <p className="font-body text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      </div>
    );

  return (
    <div className={pageShell}>
      <h1 className="font-heading mb-6 text-2xl">{t("title")}</h1>
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
              role="link"
              className={cn(
                "flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50",
                !not.isRead && "border-l-2 border-l-primary",
              )}
              onClick={() => {
                if (!not.isRead) markAsRead(not._id);
                const href = getNotificationHref(not);
                if (href) router.push(href);
              }}
            >
              <Checkbox
                className="shrink-0 rounded-sm"
                onClick={(event) => event.stopPropagation()}
              />

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
                {formatNotificationTime(not.createdAt, locale)}
              </time>
            </div>

            {i < notifications.length - 1 ? <Separator /> : null}
          </li>
        ))}
      </ul>

      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />
    </div>
  );
}

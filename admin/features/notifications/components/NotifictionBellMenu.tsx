"use client";

import { BellIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Button } from "@/components/ui/button";
import { NotificationDTO } from "../types/notification";
import { useNotifications } from "../hooks/useNotifications";
import { useUnreadCount } from "../hooks/useUnReadCount";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { useRouter } from "next/navigation";

function formatNotificationTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("de-DE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNotificationHref(not: NotificationDTO) {
  const link = not.linkNotification;
  if (link && link.startsWith("/")) return link;
  return "/notifications";
}

export function NotificationBellMenu() {
  const router = useRouter();
  const { data: listData, isPending, isError } = useNotifications();
  const { data: unreadData } = useUnreadCount();

  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const unreadCount = unreadData?.data?.count || 0;
  /*   Hem okunan hem okunmayan TÜM bildirimler */

  const notifications = Array.isArray(listData?.result) ? listData.result : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            type="button"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} ungelesene Benachrichtigungen`
                : "Benachrichtigungen"
            }
            className="relative inline-flex size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <BellIcon className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[12px] font-medium leading-none text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />

      {/* overlay*/}
      <DropdownMenuContent align="end" className="w-80 min-w-80 p-0">
        {/* baslık */}
        <div className="px-4 py-3 font-heading font-semibold text-sm text-foreground">
          Benachrichtigungen
        </div>
        <DropdownMenuSeparator />

        {/* LİSTE ALANI scroll olusturdm */}
        <div className=" max-h-80 overflow-y-auto">
          {isPending ? (
            <p className="px-4 py-4 text-center text-sm text-muted-foreground">
              Wird geladen...
            </p>
          ) : isError ? (
            <p className="px-4 py-4 text-center text-sm text-destructive">
              Benachrichtigungen konnten nicht geladen werden.
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-4 text-center text-sm text-muted-foreground">
              Du hast keine Benachrichtigungen.
            </p>
          ) : (
            /* tüm bildirimler, l,stele */
            notifications.map((not:NotificationDTO) => (
              <DropdownMenuItem
                key={not._id}
                className="items-start gap-3 rounded-none p-4"
                onClick={() => {
                  if (!not.isRead) {
                    markAsRead(not._id);
                  }
                  router.push(getNotificationHref(not));
                }}
              >
                {/* okunmamıslara ısaretledm */}
                {!not.isRead ? (
                  <span className="mt-1.5 flex size-2 shrink-0 rounded-full bg-primary" />
                ) : (
                  <span className="mt-1.5 flex size-2 shrink-0" />
                )}

                {/* bildirimin içerigi */}
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-heading",
                      not.isRead
                        ? "text-muted-foreground" // Okunduysa gri (soluk)
                        : "font-medium text-foreground", // Okunmadıysa belirgin
                    )}
                  >
                    {not.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs font-body text-muted-foreground">
                    {not.message}
                  </span>
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {formatNotificationTime(not.createdAt)}
                  </span>
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        {/* en alt kısımda hepsını okundu yapmak ısterse */}
        <div className="p-1">
          <DropdownMenuItem
            disabled={unreadCount === 0 || isMarkingAll}
            /*  İşlem yoksa veya okunmamış kalmadıysa kitle */
            className="justify-center text-sm font-medium text-primary"
            onClick={(e) => {
              e.preventDefault();
              markAllAsRead(); 
            }}
          >
            Alle als gelesen markieren
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

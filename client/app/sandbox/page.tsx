"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";

const MOCK_NOTIFICATIONS = [
  {
    _id: "1",
    title: "Yeni etkinlik: Vorlesen für Kleinkinder",
    message: "Kütüphanede çocuklara kitap okuma saati açıldı.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "2",
    title: "Etkinlik hatırlatması",
    message: "Familienpicknick im Park yarın başlıyor.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
  },
  {
    _id: "3",
    title: "Hoş geldin",
    message: "Kitzaa’ya hoş geldin. Bildirimlerini buradan takip edebilirsin.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 gün önce
  },
];

export default function DropdownMenuBasic() {
  /* okunmamısları getır -tanstack yazıcm */
  const unRead = MOCK_NOTIFICATIONS.filter((not) => !not.isRead).length;
  console.log(unRead);
  return (
    <div className="flex min-h-screen items-start justify-center pt-20 bg-amber-200">
      <DropdownMenu orientation="horizontal">
        {" "}
        {/* default horızantal */}
        {/* tetıkleyici can ve rozet */}
        <DropdownMenuTrigger
          openOnHover
          delay={200}
          render={
            <Button
              variant="outline"
              className="relative inline-flex size-10 items-center justify-center rounded-full bg-primary text-[12px] font-medium  leading-none text-primary-foreground"
              size="icon-lg"
              type="button"
            >
              <Bell className="h-5 w-5 size-5" />
              {unRead > 0 && (
                <span className="absolute top-1.5 -left--1.5 flex h-4 min-w-4 items-center justify-center rounded-full">
                  {unRead > 9 ? "9+" : unRead}
                </span>
              )}
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-80 min-w-80 max-h-80  p-0"
        >
          {/* baslık */}
          <div className="px-4 py-3 font-semibold text-sm text-foreground font-heading">
            Bildirimler
          </div>

          <div className="max-h-80 overflow-y-auto">
            {MOCK_NOTIFICATIONS.length === 0 ? (
              <p className="px-4 py-4 text-center text-sm text-muted-foreground font-body">
                Son bir ayda hiç bildirimin yok
              </p>
            ) : (
              MOCK_NOTIFICATIONS.map((not) => (
                <DropdownMenuItem
                  key={not._id}
                  className="items-start gap-3 rounded-none p-4"
                  nativeButton={false} // Base UI'de Link kullanmak için KRİTİK!
                   render={<Link href={`/notifications`} />} 
                 /*  render={<Link href={not.linkNotification || "/notifications"} />}  */

                >
                  {/* okunmamıssa nokta */}
                  {!not.isRead ? (
                    <span className="mt-1.5 flex size-2 rounded-full shrink-0 bg-primary" />
                  ) : (
                    <span className="mt-1.5 flex size-2 shrink-0  " /> // Hizalama için boş alan
                  )}

                  {/* bildirim metni */}

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm",
                        not.isRead
                          ? "text-muted-foreground" // Okunmuşsa soluk
                          : "font-medium text-foreground", // Okunmamışsa belirgin (koyu)
                      )}
                    >
                      {not.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {not.message}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {new Date(not.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
   
              <DropdownMenuSeparator/>
            {/* ALT AKSİYON: TÜMÜNÜ GÖSTER / TÜMÜNÜ OKUNDU İŞARETLE */}
          <div className="p-1 mx-auto">
            <DropdownMenuItem 
              className="justify-center items-center text-sm font-medium text-primary"
              nativeButton={false}
              render={<Button variant="outline" />}
            >
              Tümünü Okundu Yap
            </DropdownMenuItem>
          </div>

          {/*    <DropdownMenuGroup>
           
            <DropdownMenuItem disabled>Profile disabled</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {" "}
              destructive Billing
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator orientation="horizontal" />
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuSeparator orientation="horizontal" />
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator orientation="horizontal" />
          <DropdownMenuItem disabled>API</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

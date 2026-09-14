"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BellCheckIcon,
  Calendar,
  FileCheck2,
  LayoutDashboardIcon,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();
  console.log(pathname);
  const menuItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", href: "/" },
    { icon: Calendar, label: "Events", href: "/events" },
    {
      icon: FileCheck2,
      label: "Applications",
      href: "/organizer-applications",
    },
    { icon: Users, label: "Kullanıcılar", href: "/users" },
    { icon: BellCheckIcon, label: "Etkinlikler", href: "/notifications" },
    { icon: Settings, label: "Ayarlar", href: "/settings" },
  ];
  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 flex translate-x-0 flex-row items-center justify-between gap-0 rounded-2xl border border-sidebar-border bg-sidebar px-1 py-1 shadow-xl desktop:inset-x-auto desktop:bottom-auto desktop:left-4 desktop:top-1/2 desktop:-translate-y-1/2 desktop:flex-col desktop:justify-center desktop:gap-6 desktop:rounded-full desktop:px-1.5 desktop:py-2">
      <TooltipProvider>
        {menuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(`${item.href}/`) || pathname === item.href;

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full p-3 transition-all hover:bg-sidebar-primary hover:text-sidebar-primary-foreground ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : ""
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                  </Link>
                }
              />
              <TooltipContent
                side="right"
                sideOffset={6}
                className="ml-2 hidden border-none bg-primary text-sidebar-accent desktop:block"
              >
                <p className="font-heading font-medium">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </aside>
  );
}

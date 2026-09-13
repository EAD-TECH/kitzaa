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
    <aside className="fixed z-40 left-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6 rounded-full py-2 px-1.5 shadow-xl  border border-sidebar-border  bg-sidebar">
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
                className="ml-2 bg-primary text-sidebar-accent border-none"
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

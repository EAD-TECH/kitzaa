"use client";


import Link from "next/link";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Bell, ChevronDown, Moon,  Sun, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import DynamicBreadCrumb from "./dynamic.breadcrumb";

import { Separator } from "../ui/separator";

export default function Header() {
  const { data: user } = useCurrentUser();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = resolvedTheme === "dark";
  useEffect(() => setMounted(true), []);

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}` ||
    user?.username?.slice(0, 2).toUpperCase() ||
    "AD";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/90 backdrop-blur">
     <div className="flex items-center gap-2">
      <Link href="/"  className="font-heading h-8 w-8 bg-primary rounded-xl flex items-center justify-center text-sidebar-accent">k</Link>
      
      <Separator orientation="vertical" className="h-8 bg-accent " />
        <DynamicBreadCrumb/>
      </div> 

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
          disabled={!mounted}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-full"
        >
          {!mounted ? (
            <span className="size-5" />
          ) : isDark ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Bildirimler — yakında"
          disabled
          className="rounded-full disabled:opacity-100"
        >
          <Bell className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-11 gap-2 rounded-full px-2"
                aria-label="Profil menüsünü aç"
              >
                <Avatar>
                  {user?.avatar && (
                    <AvatarImage
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="hidden text-left desktop:block">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  {/*  <p className="text-xs text-muted-foreground">Admin</p> */}
                </div>

                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            }
          />

          <DropdownMenuContent align="end" sideOffset={8} className="w-64">
            <DropdownMenuLabel>
              <p>{user?.username}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled>
              <UserRound />
              
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

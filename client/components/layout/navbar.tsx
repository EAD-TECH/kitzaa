"use client";

import { BellIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logo from "../../public/images/kitzaa-terracotta-transparent.png";
import userImage from "../../public/images/user-image.png";
import Image from "next/image";
import { Comfortaa } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AiFillHome, AiFillCalendar } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { IoMoon, IoShareSocial } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUnreadCount } from "@/features/notifications/hooks/useUnReadCount";
import { NotificationBellMenu } from "@/features/notifications/components/NotificationBellMenu";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400"],
});

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/social", label: "Social" },
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLight = theme !== "dark";
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();

  const { logout } = useLogout();
  const { data } = useUnreadCount();
  console.log(data);
  const unreadCount = data?.data?.count || 0;
  console.log(unreadCount);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex items-center justify-between px-3 tablet:px-5 desktop:px-8 bg-card/40 border-b border-border sticky backdrop-blur-sm">

      {/* logo  */}

      <Link href="/home" className="flex items-center">
        <Image
          className="w-34 py-2 tablet:py-1 "
          src={logo}
          alt="Kitzaa logo"
        />
      </Link>

      {/* navigation menu  */}

      <div className="hidden tablet:flex items-center tablet:gap-12 desktop:gap-20 font-heading text-lg">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative py-1 transition-colors duration-300",
                isActive
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-spring",
                  isActive
                    ? "scale-x-100"
                    : "group-hover:scale-x-100 group-hover:bg-primary/40",
                )}
              />
            </Link>
          );
        })}
      </div>

      <div className="my-auto flex items-center gap-3">
        {/* Theme and notification buttons  */}
        <div className="flex items-center gap-1 mt-2 tablet:mt-0">
          
          {/* overlay bılesenı */}
          {currentUser && <NotificationBellMenu />}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Theme change"
            className="relative overflow-hidden rounded-full text-muted-foreground hover:text-foreground cursor-pointer -mt-1 tablet:me-2"
          >
            <MdSunny
              className={cn(
                "absolute inset-0 m-auto size-5 text-primary transition-all duration-500 ease-spring",
                isLight
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 -rotate-90 opacity-0",
              )}
            />
            <IoMoon
              className={cn(
                "absolute inset-0 m-auto size-5 text-primary transition-all duration-500 ease-spring",
                !isLight
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 rotate-90 opacity-0",
              )}
            />
          </Button>
        </div>
        {/* login button  */} {/* dropdown menu  */}
        {!currentUser ? (
          <div>
            <Button nativeButton={false} render={<Link href="/login" />}>
              Login
            </Button>
          </div>
        ) : (
          <div className="">
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="tablet:rounded-full cursor-pointer size-10 hover:bg-transparent aria-expanded:bg-transparent tablet:hover:bg-muted tablet:aria-expanded:bg-muted"
                  >
                    <Avatar className="hidden tablet:block size-9">
                      <AvatarImage src={userImage.src} alt="user Image" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>

                    {/* hamburger menu  */}

                    <span className="relative flex tablet:hidden h-10 w-10 items-center justify-center rounded-sm border border-stone-200/60 bg-stone-100/80 shadow-xs transition-all duration-300 hover:shadow-md active:scale-95 dark:border-zinc-700/60 dark:bg-zinc-800/80">
                      <span className="relative flex h-3.5 w-4.5 flex-col items-center justify-between">
                        <span
                          className={cn(
                            "h-0.5 w-full origin-center rounded-full bg-foreground transition-all duration-300 ease-spring",
                            menuOpen && "translate-y-1.5 rotate-45",
                          )}
                        />
                        <span
                          className={cn(
                            "h-0.5 w-full rounded-full bg-foreground transition-all duration-300 ease-spring",
                            menuOpen && "scale-x-0 opacity-0",
                          )}
                        />
                        <span
                          className={cn(
                            "h-0.5 w-full origin-center rounded-full bg-foreground transition-all duration-300 ease-spring",
                            menuOpen && "-translate-y-1.5 -rotate-45",
                          )}
                        />
                      </span>
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuGroup className="tablet:hidden">
                  <DropdownMenuItem>
                    <AiFillHome />
                    <Link href="/home">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AiFillCalendar />
                    <Link href="/events">Events</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IoShareSocial />
                    <Link href="/social">Social</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FaUser />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold text-primary focus:text-primary"
                  onClick={handleLogout}
                >
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

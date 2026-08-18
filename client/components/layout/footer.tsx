"use client";

import Image from "next/image";
import logo from "../../public/images/logo2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const footerLinks = [
  { title: "Home", href: "/home" },
  { title: "Events", href: "/events" },
  { title: "Social", href: "/social" },
  { title: "Impressum", href: "#" },
  { title: "Datenschutz", href: "#" },
];

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-3 py-8 tablet:px-5 desktop:px-8 sm:flex-row">
        <div>
          <Link href="/home" className="flex items-center">
            <Image
              className="w-34 py-2 tablet:py-1"
              src={logo}
              alt="Kitzaa"
            />
          </Link>

          <ul className="mt-6 flex flex-wrap items-center gap-4">
            {footerLinks.map(({ title, href }) => (
              <li key={title}>
                <Link
                  className="text-muted-foreground hover:text-foreground"
                  href={href}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-xs">
          <h6 className="font-medium">Bleib auf dem Laufenden</h6>
          <form
            className="mt-6 flex items-center gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input placeholder="E-Mail-Adresse" type="email" />
            <Button type="button">Abonnieren</Button>
          </form>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-3 py-4 tablet:px-5 desktop:px-8 sm:flex-row">
        <span className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Kitzaa. Alle Rechte vorbehalten.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

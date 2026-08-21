import Image from "next/image";
import logo from "../../public/images/kitzaa-terracotta-transparent.png";
import Link from "next/link";

const footerLinks = [
  { title: "FAQ", href: "#" },
  { title: "Kontakt", href: "#" },
  { title: "Datenschutzpolitik", href: "#" },
  { title: "Zustellungsbedingungen", href: "#" },
];

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-24">
      <div className="flex flex-col items-center px-3 py-3 tablet:px-5 desktop:px-8">
        <Link href="/home" className="flex items-center">
          <Image className="w-30 py-1" src={logo} alt="Kitzaa" />
        </Link>

        <ul className="mt-3 flex flex-wrap items-center justify-center gap-4">
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

        <span className="mt-5 text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Kitzaa. Alle Rechte vorbehalten.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

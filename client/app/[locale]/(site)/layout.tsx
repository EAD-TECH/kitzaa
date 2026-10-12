import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import SupportChat from "@/features/socket/components/SupportChat";

export default function SiteLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {modal}
      <SupportChat />
    </>
  );
}

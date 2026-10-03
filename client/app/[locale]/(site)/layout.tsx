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
      <div className="fixed right-4 bottom-4 z-40 h-48 rounded-lg bg-red-500">
        <SupportChat />
      </div>
    </>
  );
}

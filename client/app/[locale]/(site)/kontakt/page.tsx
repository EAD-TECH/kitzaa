import { StaticPage, staticPageMetadata } from "@/features/content/components/StaticPage";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return staticPageMetadata(locale, "ContactPage");
}

export default function ContactPage() {
  return <StaticPage namespace="ContactPage" />;
}

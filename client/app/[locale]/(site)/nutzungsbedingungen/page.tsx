import { StaticPage, staticPageMetadata } from "@/features/content/components/StaticPage";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return staticPageMetadata(locale, "TermsPage");
}

export default function TermsPage() {
  return <StaticPage namespace="TermsPage" />;
}

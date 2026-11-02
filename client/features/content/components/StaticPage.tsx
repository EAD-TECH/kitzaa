import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const STATIC_PAGE_NAMESPACES = [
  "FaqPage",
  "ContactPage",
  "PrivacyPage",
  "TermsPage",
] as const;

export type StaticPageNamespace = (typeof STATIC_PAGE_NAMESPACES)[number];

type ContentSection = {
  title: string;
  paragraphs: string[];
};

function readSections(value: unknown): ContentSection[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const section = item as Record<string, unknown>;
    if (typeof section.title !== "string" || !Array.isArray(section.paragraphs)) {
      return [];
    }

    const paragraphs = section.paragraphs.filter(
      (paragraph): paragraph is string => typeof paragraph === "string",
    );

    if (paragraphs.length === 0 || paragraphs.length !== section.paragraphs.length) {
      return [];
    }

    return [{ title: section.title, paragraphs }];
  });
}

export async function staticPageMetadata(
  locale: string,
  namespace: StaticPageNamespace,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  return {
    title: `${t("title")} | Kitzaa`,
    description: t("intro"),
  };
}

export async function StaticPage({ namespace }: { namespace: StaticPageNamespace }) {
  const t = await getTranslations(namespace);
  const sections = readSections(t.raw("sections"));
  const email = t.has("email") ? t("email") : null;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12 tablet:px-10 tablet:py-16">
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-balance tablet:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-sm text-muted-foreground tablet:text-base">{t("intro")}</p>

      {email ? (
        <p className="mt-6">
          <a
            className="font-medium text-primary underline-offset-4 hover:underline"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </p>
      ) : null}

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl font-semibold">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={`${section.title}-${index}`}
                  className="text-sm leading-relaxed text-muted-foreground tablet:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

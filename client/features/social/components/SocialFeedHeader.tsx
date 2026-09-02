"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface SocialFeedHeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function SocialFeedHeader({ search, setSearch }: SocialFeedHeaderProps) {
  const t = useTranslations("Social");
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(inputValue);
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue, setSearch]);

  return (
    <header className="mx-auto mb-6 w-full max-w-xl">
      <p className="font-heading text-xs font-medium tracking-wide text-primary uppercase">
        {t("headerKicker")}
      </p>
      <h1 className="mt-1 font-heading text-3xl font-semibold">{t("headerTitle")}</h1>

      <InputGroup className="mt-5 bg-background shadow-2xs">
        <InputGroupInput
          id="social-feed-search"
          aria-label={t("searchAria")}
          placeholder={t("searchPlaceholder")}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <Search className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </header>
  );
}

export default SocialFeedHeader;

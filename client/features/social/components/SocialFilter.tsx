"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { germanCities, germanCitySet } from "../data/germanCities";
import { useEvents } from "../hooks/useEvents";

const ALL_CITIES = "all";
const CITY_RESULT_LIMIT = 40;

function foldForSearch(value: string, umlautStyle: "digraph" | "base") {
  const folded = value.trim().toLocaleLowerCase("de-DE").replaceAll("ß", "ss");
  if (umlautStyle === "digraph") {
    return folded.replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue");
  }
  return folded.replaceAll("ä", "a").replaceAll("ö", "o").replaceAll("ü", "u");
}

function cityMatchesQuery(city: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return true;

  return (
    foldForSearch(city, "digraph").includes(foldForSearch(trimmed, "digraph")) ||
    foldForSearch(city, "base").includes(foldForSearch(trimmed, "base"))
  );
}

export type PostSort = {
  createdAt?: 1 | -1;
};

interface SocialFilterTriggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panelId: string;
  className?: string;
}

export function SocialFilterTrigger({
  open,
  onOpenChange,
  panelId,
  className,
}: SocialFilterTriggerProps) {
  const t = useTranslations("Social");

  return (
    <Button
      type="button"
      variant="outline"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => onOpenChange(!open)}
      className={cn(
        "h-9 shrink-0 gap-2 rounded-xl border-border bg-background px-3 text-foreground shadow-xs",
        className,
      )}
    >
      <SlidersHorizontal className="size-4" />
      {t("filter")}
    </Button>
  );
}

interface SocialFilterProps {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  eventId: string;
  setEventId: React.Dispatch<React.SetStateAction<string>>;
  sort: PostSort;
  setSort: React.Dispatch<React.SetStateAction<PostSort>>;
  id?: string;
  className?: string;
}

const SocialFilter = ({
  city,
  setCity,
  eventId,
  setEventId,
  sort,
  setSort,
  id,
  className,
}: SocialFilterProps) => {
  const t = useTranslations("Social");
  const { data } = useEvents();
  const events = data?.events ?? [];
  const allCitiesLabel = t("allCities");
  const cityOptions = useMemo(() => {
    const names =
      city && !germanCitySet.has(city)
        ? [...germanCities, city].sort((left, right) =>
            left.localeCompare(right, "de", { sensitivity: "base" }),
          )
        : germanCities;

    return [ALL_CITIES, ...names];
  }, [city]);

  const selectedEvent = events.find((event) => event._id === eventId);

  const sortValue = sort.createdAt === 1 ? "oldest" : sort.createdAt === -1 ? "newest" : "popular";
  const sortItems = [
    { label: t("sortNewest"), value: "newest" },
    { label: t("sortOldest"), value: "oldest" },
    { label: t("sortPopular"), value: "popular" },
  ];

  return (
    <div
      id={id}
      className={cn(
        "w-full rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-4">
        <Field>
          <FieldLabel>{t("cityLabel")}</FieldLabel>

          <Combobox
            items={cityOptions}
            value={city || ALL_CITIES}
            onValueChange={(value) => setCity(!value || value === ALL_CITIES ? "" : value)}
            itemToStringLabel={(item) => (item === ALL_CITIES ? allCitiesLabel : item)}
            filter={(item, query) =>
              item === ALL_CITIES
                ? cityMatchesQuery(allCitiesLabel, query)
                : cityMatchesQuery(item, query)
            }
            limit={CITY_RESULT_LIMIT}
            locale="de"
          >
            <ComboboxInput placeholder={t("cityPlaceholder")} className="w-full" />
            <ComboboxContent>
              <ComboboxEmpty>{t("noCityFound")}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item === ALL_CITIES ? allCitiesLabel : item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field>
          <FieldLabel>{t("eventLabel")}</FieldLabel>

          <Select
            value={eventId || "all"}
            onValueChange={(value) => setEventId(!value || value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{selectedEvent?.title ?? t("allEvents")}</SelectValue>
            </SelectTrigger>

            <SelectContent align="start" className="max-w-[calc(100vw-2rem)]">
              <SelectGroup>
                <SelectItem value="all">{t("allEvents")}</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    <span className="whitespace-normal wrap-break-word">{event.title}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{t("sortLabel")}</FieldLabel>

          <Select
            value={sortValue}
            onValueChange={(value) => {
              if (value === "newest") {
                setSort({ createdAt: -1 });
              } else if (value === "oldest") {
                setSort({ createdAt: 1 });
              } else if (value === "popular") {
                setSort({});
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {sortItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
};

export default SocialFilter;

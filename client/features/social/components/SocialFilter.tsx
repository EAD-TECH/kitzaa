"use client";

import { Field, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { useTranslations } from "next-intl";

const cityItems = [
  { label: "Berlin", value: "Berlin" },
  { label: "Karlsruhe", value: "Karlsruhe" },
  { label: "Pforzheim", value: "Pforzheim" },
  { label: "Stuttgart", value: "Stuttgart" },
];

export type PostSort = {
  createdAt?: 1 | -1;
};

interface SocialFilterProps {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  eventId: string;
  setEventId: React.Dispatch<React.SetStateAction<string>>;
  sort: PostSort;
  setSort: React.Dispatch<React.SetStateAction<PostSort>>;
}

const SocialFilter = ({ city, setCity, eventId, setEventId, sort, setSort }: SocialFilterProps) => {
  const t = useTranslations("Social");
  const { data } = useEvents();
  const events = data?.events ?? [];

  const selectedEvent = events.find((event) => event._id === eventId);

  const sortValue = sort.createdAt === 1 ? "oldest" : sort.createdAt === -1 ? "newest" : "popular";
  const sortItems = [
    { label: t("sortNewest"), value: "newest" },
    { label: t("sortOldest"), value: "oldest" },
    { label: t("sortPopular"), value: "popular" },
  ];

  return (
    <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-4">
        <Field>
          <FieldLabel>{t("cityLabel")}</FieldLabel>

          <Select
            value={city || "all"}
            onValueChange={(value) => setCity(!value || value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("cityPlaceholder")} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t("allCities")}</SelectItem>
                {cityItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
                    <span className="whitespace-normal wrap-break-word">
                      {event.title}
                    </span>
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

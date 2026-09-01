import { SearchIcon } from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { useEffect, useState } from "react";

const cityItems = [
  { label: "Berlin", value: "Berlin" },
  { label: "Karlsruhe", value: "Karlsruhe" },
  { label: "Pforzheim", value: "Pforzheim" },
  { label: "Stuttgart", value: "Stuttgart" },
];

const sortItems = [
  { label: "Neueste zuerst", value: "newest" },
  { label: "Älteste zuerst", value: "oldest" },
  { label: "Beliebteste", value: "popular" },
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
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SocialFilter = ({ city, setCity, eventId, setEventId, sort, setSort, search, setSearch }: SocialFilterProps) => {
  const { data } = useEvents();
  const events = data?.events ?? [];

  const selectedEvent = events.find((event) => event._id === eventId);

  const sortValue = sort.createdAt === 1 ? "oldest" : sort.createdAt === -1 ? "newest" : "popular";

  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(inputValue);
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue, setSearch]);

  return (
    <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur-sm">
      <Field>
        <FieldLabel htmlFor="social-search">Suche</FieldLabel>

        <InputGroup>
          <InputGroupInput
            id="social-search"
            placeholder="Beiträge, Orte, Aktivitäten..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <Field>
          <FieldLabel>Stadt</FieldLabel>

          <Select
            value={city || "all"}
            onValueChange={(value) => setCity(!value || value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Stadt wählen" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Alle Städte</SelectItem>
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
          <FieldLabel>Event</FieldLabel>

          <Select
            value={eventId || "all"}
            onValueChange={(value) => setEventId(!value || value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{selectedEvent?.title ?? "Alle Events"}</SelectValue>
            </SelectTrigger>

            <SelectContent align="start" className="max-w-[calc(100vw-2rem)]">
              <SelectGroup>
                <SelectItem value="all">Alle Events</SelectItem>
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
          <FieldLabel>Sortierung</FieldLabel>

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

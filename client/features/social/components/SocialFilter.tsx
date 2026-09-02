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
}

const SocialFilter = ({ city, setCity, eventId, setEventId, sort, setSort }: SocialFilterProps) => {
  const { data } = useEvents();
  const events = data?.events ?? [];

  const selectedEvent = events.find((event) => event._id === eventId);

  const sortValue = sort.createdAt === 1 ? "oldest" : sort.createdAt === -1 ? "newest" : "popular";

  return (
    <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-4">
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

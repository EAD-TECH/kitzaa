"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Info } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostInput } from "../validations/post.schema";
import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { usePlaceSearch } from "../hooks/usePlaceSearch";
import { useCreatePost } from "../hooks/useCreatePost";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function CreatePostForm({ onCreated }: { onCreated?: () => void }) {
  const { data } = useEvents();
  const events = data?.events ?? [];
  const [placeQuery, setPlaceQuery] = useState("");
  const { data: places = [] } = usePlaceSearch(placeQuery);
  const createPost = useCreatePost();
  

  const  { data: currentUser } = useCurrentUser();
  // console.log(currentUser);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
      imageUrl: null,
      eventId: null,
      placeName: null,
      city: null,
      location: null,
    },
  });

  const text =
    useWatch({
      control: form.control,
      name: "text",
      defaultValue: "",
    }) ?? "";

  const onSubmit = (data: CreatePostInput) => {
  createPost.mutate(data, {
    onSuccess: () => {
      form.reset();
      setPlaceQuery("");
      onCreated?.();
    },
  });
};

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 desktop:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Bildbereich */}
        <section className="flex min-h-80 items-center justify-center border-b bg-muted/20 p-6 desktop:min-h-140 desktop:border-r desktop:border-b-0">
          <div className="flex max-w-xs flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ImagePlus className="size-6" />
            </div>

            <p className="mt-4 text-sm font-medium">Bild hinzufügen</p>

            <p className="mt-1 text-sm text-muted-foreground">Optional</p>

            <Button type="button" variant="outline" size="sm" className="mt-4">
              Auswählen
            </Button>

            <p className="mt-6 text-xs text-muted-foreground">
              Ein Bild kann deine Empfehlung noch anschaulicher machen.
            </p>
          </div>
        </section>

        {/* Formularbereich */}
        <section className="min-w-0 p-6">
          {/* User Preview */}
          <div className="flex items-center gap-3 border-b pb-4">
            <Avatar>
              <AvatarFallback>{currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{currentUser?.firstName} {currentUser?.lastName}</p>
              <p className="truncate text-xs text-muted-foreground">@{currentUser?.username}</p>
            </div>
          </div>

          <FieldGroup className="mt-5 gap-5">
            {/* Post Text */}
            <Field>
              <FieldLabel htmlFor="post-text">
                Was möchtest du teilen?
                <span className="font-normal text-muted-foreground">(erforderlich)</span>
              </FieldLabel>

              <Textarea
                id="post-text"
                maxLength={1000}
                placeholder="Was möchtest du mit anderen Eltern teilen?"
                className="min-h-36 resize-none"
                {...form.register("text")}
              />

              <FieldError errors={[form.formState.errors.text]} />

              <FieldDescription className="flex items-center justify-between gap-4">
                <span>Ein freundlicher Austausch macht Kitzaa aus.</span>

                <span className="shrink-0">{text.length} / 5000 Zeichen</span>
              </FieldDescription>
            </Field>

            {/* Event */}
            <Field>
              <FieldLabel>
                Event
                <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Controller
                name="eventId"
                control={form.control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Combobox
                    items={events}
                    value={events.find((event) => event._id === value) ?? null}
                    onValueChange={(event) => onChange(event?._id ?? null)}
                    itemToStringLabel={(event) => event.title}
                  >
                    <ComboboxInput placeholder="Event auswählen" showClear />
                    <ComboboxContent>
                      <ComboboxEmpty>Kein Event gefunden.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item._id} value={item}>
                            {item.title}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
            </Field>

            {/* Ort */}
            <Field>
              <FieldLabel>
                Ort
                <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>

              <Controller
                name="placeName"
                control={form.control}
                render={({ field: { onChange, value } }) => {
                  const selectedLocation = form.getValues("location");
                  const selectedPlace =
                    value && selectedLocation
                      ? {
                          placeName: value,
                          city: form.getValues("city"),
                          lat: selectedLocation.lat,
                          lng: selectedLocation.lng,
                        }
                      : null;

                  const placeItems = selectedPlace
                    ? [
                        selectedPlace,
                        ...places.filter(
                          (place) => place.lat !== selectedPlace.lat || place.lng !== selectedPlace.lng,
                        ),
                      ]
                    : places;

                  return (
                    <Combobox
                      items={placeItems}
                      value={selectedPlace}
                      inputValue={placeQuery}
                      onValueChange={(place) => {
                        onChange(place?.placeName ?? null);
                        form.setValue("city", place?.city ?? null);
                        form.setValue("location", place ? { lat: place.lat, lng: place.lng } : null);
                        setPlaceQuery(
                          place?.city ? `${place.placeName}, ${place.city}` : (place?.placeName ?? ""),
                        );
                      }}
                      onInputValueChange={(inputValue) => {
                        setPlaceQuery(inputValue);
                      }}
                      itemToStringLabel={(place) =>
                        place?.city ? `${place.placeName}, ${place.city}` : (place?.placeName ?? "")
                      }
                      isItemEqualToValue={(item, selected) =>
                        Boolean(item && selected && item.lat === selected.lat && item.lng === selected.lng)
                      }
                    >
                      <ComboboxInput placeholder="Ort suchen" showClear className="w-full" />
                      <ComboboxContent>
                        <ComboboxEmpty>Kein Ort gefunden.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={`${item.lat}-${item.lng}`} value={item}>
                              <span>
                                {item.placeName}
                                {item.city ? (
                                  <span className="block text-xs text-muted-foreground">{item.city}</span>
                                ) : null}
                              </span>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  );
                }}
              />
            </Field>
          </FieldGroup>

          {/* Community Hinweis */}
          <div className="mt-5 flex gap-2 rounded-xl border bg-muted/40 p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Dein Beitrag wird in deiner lokalen Kitzaa Community sichtbar.
            </p>
          </div>

          {/* Submit */}
          <div className="mt-5 border-t pt-5">
            <p className="text-xs text-muted-foreground">
              Mit deinem Beitrag hilfst du anderen Familien, schöne Orte und Aktivitäten zu entdecken.
            </p>

            <Button type="submit" className="mt-4 w-full" disabled={createPost.isPending}>
              {createPost.isPending ? "Wird veröffentlicht..." : "Beitrag veröffentlichen"}
            </Button>
          </div>
        </section>
      </div>
    </form>
  );
}

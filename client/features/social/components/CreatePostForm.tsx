"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Info, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostInput } from "../validations/post.schema";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
import { useCreatePost, useUpdatePost } from "../hooks/socialHooks";
import { useUploadPostImage } from "../hooks/useUploadPostImage";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { PostDTO } from "../types/post.types";

// uploadRouter.socialImage (server/src/configs/uploadthing.ts) ile birebir aynı limit.
const MAX_POST_IMAGE_SIZE_MB = 8;

interface CreatePostFormProps {
  onCreated?: () => void;
  post?: PostDTO;
}

export default function CreatePostForm({ onCreated, post }: CreatePostFormProps) {
  const isEditMode = Boolean(post);

  const { data } = useEvents();
  const events = data?.events ?? [];
  const [placeQuery, setPlaceQuery] = useState("");
  const { data: places = [] } = usePlaceSearch(placeQuery);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const uploadImage = useUploadPostImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

  const { data: currentUser } = useCurrentUser();

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

  useEffect(() => {
    if (!post) return;

    form.reset({
      text: post.text,
      imageUrl: post.imageUrl,
      eventId: post.event?._id ?? null,
      placeName: post.placeName,
      city: post.city,
      location: post.location,
    });

    setPlaceQuery(
      post.city && post.placeName
        ? `${post.placeName}, ${post.city}`
        : (post.placeName ?? ""),
    );

    if (post.imageUrl) {
      setPreviewUrl(post.imageUrl);
      setImageStatus("done");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const text =
    useWatch({
      control: form.control,
      name: "text",
      defaultValue: "",
    }) ?? "";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearImage = () => {
    setPreviewUrl(null);
    setImageStatus("idle");
    form.setValue("imageUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    if (imageStatus === "uploading") return;

    if (!file.type.startsWith("image/")) {
      toast.error("Bitte wähle eine Bilddatei aus.");
      return;
    }

    if (file.size > MAX_POST_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`"${file.name}" ist größer als ${MAX_POST_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setImageStatus("uploading");
    form.setValue("imageUrl", null);

    try {
      const url = await uploadImage.mutateAsync(file);
      setImageStatus("done");
      form.setValue("imageUrl", url, { shouldValidate: true });
    } catch {
      setImageStatus("error");
    }
  };

  const onSubmit = (data: CreatePostInput) => {
    if (imageStatus === "uploading" || imageStatus === "error") return;

    if (isEditMode && post) {
      updatePost.mutate(
        { id: post._id, payload: data },
        { onSuccess: () => onCreated?.() },
      );
      return;
    }

    createPost.mutate(data, {
      onSuccess: () => {
        clearImage();
        form.reset();
        setPlaceQuery("");
        onCreated?.();
      },
    });
  };

  const isImageBusy = imageStatus === "uploading";
  const isPending = createPost.isPending || updatePost.isPending;
  const canSubmit = !isPending && imageStatus !== "uploading" && imageStatus !== "error";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 desktop:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Bildbereich */}
        <section className="relative flex min-h-80 items-center justify-center overflow-hidden border-b bg-muted/20 p-6 desktop:min-h-140 desktop:border-r desktop:border-b-0">
          <input
            ref={fileInputRef}
            id="post-image"
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isImageBusy || isPending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void handleFile(file);
            }}
          />

          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Ausgewähltes Beitragsbild"
                className="absolute inset-0 size-full object-cover"
              />

              {imageStatus === "uploading" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <Loader2 className="size-6 animate-spin text-foreground" />
                </div>
              ) : null}

              {imageStatus === "error" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 px-6 text-center text-sm font-medium text-destructive">
                  Bild konnte nicht hochgeladen werden.
                </div>
              ) : null}

              <button
                type="button"
                onClick={clearImage}
                disabled={isImageBusy || isPending}
                aria-label="Bild entfernen"
                className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm disabled:opacity-50"
              >
                <X className="size-4" />
              </button>

              {imageStatus !== "uploading" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                >
                  Bild ändern
                </Button>
              ) : null}
            </>
          ) : (
            <div className="flex max-w-xs flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ImagePlus className="size-6" />
              </div>

              <p className="mt-4 text-sm font-medium">Bild hinzufügen</p>

              <p className="mt-1 text-sm text-muted-foreground">Optional</p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                Auswählen
              </Button>

              <p className="mt-6 text-xs text-muted-foreground">
                PNG, JPG oder GIF (max. {MAX_POST_IMAGE_SIZE_MB}MB). Ein Bild kann deine Empfehlung noch anschaulicher machen.
              </p>
            </div>
          )}
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

            <Button type="submit" className="mt-4 w-full" disabled={!canSubmit}>
              {isEditMode ? (updatePost.isPending ? "Wird aktualisiert..." : "Beitrag aktualisieren") : (createPost.isPending ? "Wird veröffentlicht..." : "Beitrag veröffentlichen")}
            </Button>
          </div>
        </section>
      </div>
    </form>
  );
}

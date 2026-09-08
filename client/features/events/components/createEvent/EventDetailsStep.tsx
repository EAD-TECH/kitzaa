"use client"

import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { ImagePlus, Loader2, X } from "lucide-react"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, stripHtml } from "@/lib/utils"
import type { EventCategoryDTO } from "../../types/eventCategory.types"
import type { CreateEventFormInput } from "../../types/createEvent.types"
import { AGE_RANGE_OPTIONS, LOCATION_TYPE_OPTIONS, MAX_EVENT_IMAGES, MAX_EVENT_IMAGE_SIZE_MB } from "../../constants/eventFormOptions"
import { useUploadEventImages } from "../../hooks/useUploadEventImages"
import { toast } from "sonner"

const MAX_DESCRIPTION_LENGTH = 2000

interface EventDetailsStepProps {
  form: UseFormReturn<CreateEventFormInput>
  categories: EventCategoryDTO[]
}

interface ImageItem {
  id: string
  name: string
  previewUrl: string
  status: "uploading" | "done" | "error"
  url?: string
}

// Yüklenen görselleri form state'ine (images/coverImage) bağlar: her dosya seçildiğinde
// önce yerel bir önizleme gösterilir, ardından UploadThing'e yüklenir; dönen URL form'un
// "images" alanına eklenir ve ilk görsel otomatik olarak "coverImage" yapılır.
function ImageDropzone({ form }: { form: UseFormReturn<CreateEventFormInput> }) {
  const [items, setItems] = useState<ImageItem[]>([])
  const { mutateAsync: uploadImages } = useUploadEventImages()

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addUploadedImages = (urls: string[]) => {
    const currentImages = form.getValues("images") ?? []
    const nextImages = [...currentImages, ...urls]
    form.setValue("images", nextImages, { shouldValidate: true })
    if (!form.getValues("coverImage")) {
      form.setValue("coverImage", nextImages[0] ?? null)
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return

    const currentImages = form.getValues("images") ?? []
    const incoming = Array.from(files)
    const freeSlots = MAX_EVENT_IMAGES - currentImages.length
    if (freeSlots <= 0) {
      toast.error(`Du kannst maximal ${MAX_EVENT_IMAGES} Bilder hochladen.`)
      return
    }

    const accepted = incoming.slice(0, freeSlots).filter((file) => {
      const isTooLarge = file.size > MAX_EVENT_IMAGE_SIZE_MB * 1024 * 1024
      if (isTooLarge) {
        toast.error(`"${file.name}" ist größer als ${MAX_EVENT_IMAGE_SIZE_MB}MB und wurde übersprungen.`)
      }
      return !isTooLarge
    })
    if (incoming.length > freeSlots) {
      toast.error(`Du kannst maximal ${MAX_EVENT_IMAGES} Bilder hochladen.`)
    }
    if (!accepted.length) return

    const pending: ImageItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }))
    setItems((prev) => [...prev, ...pending])

    try {
      const urls = await uploadImages(accepted)
      setItems((prev) =>
        prev.map((item) => {
          const pendingIndex = pending.findIndex((p) => p.id === item.id)
          return pendingIndex === -1 ? item : { ...item, status: "done", url: urls[pendingIndex] }
        })
      )
      addUploadedImages(urls)
    } catch {
      setItems((prev) =>
        prev.map((item) => (pending.some((p) => p.id === item.id) ? { ...item, status: "error" } : item))
      )
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item?.url) {
        const currentImages = form.getValues("images") ?? []
        const nextImages = currentImages.filter((url) => url !== item.url)
        form.setValue("images", nextImages, { shouldValidate: true })
        if (form.getValues("coverImage") === item.url) {
          form.setValue("coverImage", nextImages[0] ?? null)
        }
      }
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          void handleFiles(e.dataTransfer.files)
        }}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-input bg-background px-6 py-10 text-center transition-colors hover:bg-accent/40"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ImagePlus className="size-5" />
        </span>
        <p className="text-sm font-medium text-foreground">
          Klicke zum Hochladen oder per Drag-and-Drop verschieben
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG oder GIF (max. {MAX_EVENT_IMAGE_SIZE_MB}MB, bis zu {MAX_EVENT_IMAGES} Bilder)
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </label>

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 tablet:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt={item.name} className="size-full object-cover" />
              {item.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <Loader2 className="size-5 animate-spin text-foreground" />
                </div>
              )}
              {item.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 text-xs font-medium text-destructive">
                  Fehlgeschlagen
                </div>
              )}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Bild entfernen"
                className="absolute top-1 right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SegmentedField({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-4xl border px-4 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "border-transparent bg-(--green-500)/20 text-[color-mix(in_oklch,var(--green-500),black_35%)]"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function EventDetailsStep({ form, categories }: EventDetailsStepProps) {
  const description = form.watch("description") ?? ""
  // Select (Base UI) seçili değerin etiketini <SelectItem> çocuklarından otomatik çıkarmıyor —
  // <SelectValue>'nun "Kreativität" gibi ismi gösterebilmesi için id->isim haritasını ayrıca vermek gerekiyor.
  const categoryItems = Object.fromEntries(categories.map((category) => [category._id, category.name]))

  return (
    <div className="flex flex-col gap-10">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event-Titel *</FormLabel>
            <FormControl>
              <Input
                className="bg-background"
                placeholder="z.B. Töpfer-Workshop am Samstagmorgen"
                spellCheck={false}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorie *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={categoryItems}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-background focus-visible:ring-[0.5px] focus-visible:ring-ring/20">
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="min-h-4">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event-Ort *</FormLabel>
              <FormControl>
                <SegmentedField options={LOCATION_TYPE_OPTIONS} value={field.value} onChange={field.onChange} />
              </FormControl>
              <div className="min-h-4">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="ageRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Altersgruppe *</FormLabel>
            <FormControl>
              <SegmentedField options={AGE_RANGE_OPTIONS} value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-baseline justify-between">
              <FormLabel>Beschreibung *</FormLabel>
              <span className="text-xs text-muted-foreground">
                {stripHtml(description).length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <FormControl>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Beschreibe, was Familien bei dieser Aktivität erwarten können. Besondere Bedürfnisse oder mitzubringende Dinge erwähnen."
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>Titelbild & weitere Fotos</FormLabel>
        <ImageDropzone form={form} />
      </FormItem>
    </div>
  )
}

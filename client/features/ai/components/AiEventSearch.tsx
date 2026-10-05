"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  CalendarDays,
  Clock,
  Euro,
  Loader2,
  MapPin,
  MessageCircleQuestion,
  SearchX,
  Sparkles,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UpcomingEventCard } from "@/features/home/components/UpcomingEventCard"
import { useAiEventSearch } from "../hooks/useAiEventSearch"
import { formatSpecificDate, getFilterChips, type AiFilterChip } from "../utils/formatAiSearchResult"
import type { AiEventSearchResponse } from "../types/aiEventSearch.types"

const EXAMPLE_KEYS = ["example1", "example2", "example3"] as const

const CHIP_ICONS: Record<AiFilterChip["kind"], LucideIcon> = {
  childAges: Users,
  city: MapPin,
  date: CalendarDays,
  specificDate: CalendarDays,
  maxPrice: Euro,
  environment: Sun,
  time: Clock,
}

export function AiEventSearch() {
  const t = useTranslations("AiSearch")
  const locale = useLocale()

  const [message, setMessage] = useState("")
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [result, setResult] = useState<AiEventSearchResponse | null>(null)

  const { mutate: search, isPending } = useAiEventSearch()

  const runSearch = (text: string, activeConversationId = conversationId) => {
    const trimmed = text.trim()
    if (!trimmed || isPending) return

    setResult(null)

    search(
      { message: trimmed, conversationId: activeConversationId },
      {
        onSuccess: (response) => {
          setResult(response)
          // Takip sorusu cevabı aynı konuşmaya eklenmeli; tamamlanmış aramadan sonraki metin
          // ise yeni bir arama sayılır, yoksa model önceki filtreleri korur.
          setConversationId(response.type === "question" ? response.conversationId : undefined)
          setMessage("")
        },
      },
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    runSearch(message)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      runSearch(message)
    }
  }

  const handleExample = (text: string) => {
    setMessage(text)
    setConversationId(undefined)
    runSearch(text, undefined)
  }

  const chips = result?.type === "ready" ? getFilterChips(result.filters) : []

  const chipLabel = (chip: AiFilterChip) => {
    switch (chip.kind) {
      case "childAges":
        return t("chips.childAges", { ages: chip.value.join(", ") })
      case "city":
        return chip.value
      case "date":
        return t(`chips.date.${chip.value}`)
      case "specificDate":
        return formatSpecificDate(chip.value, locale)
      case "maxPrice":
        return t("chips.maxPrice", { price: chip.value })
      case "environment":
        return t(`chips.environment.${chip.value}`)
      case "time":
        return t(`chips.time.${chip.value}`)
    }
  }

  return (
    <section className="bg-surface-accent pt-10 tablet:pt-14">
      <div className="mx-auto max-w-7xl px-6 tablet:px-10 desktop:px-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm tablet:p-10">
          <Badge className="h-auto gap-1.5 rounded-full border-none bg-secondary/20 px-3 py-1 text-foreground">
            <Sparkles className="size-3.5" />
            {t("badge")}
          </Badge>

          <h2 className="mt-5 max-w-2xl font-heading text-2xl font-semibold text-balance text-foreground tablet:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                result?.type === "question" ? t("followUpPlaceholder") : t("example1")
              }
              aria-label={t("inputLabel")}
              maxLength={500}
              disabled={isPending}
              className="min-h-20 resize-y bg-background"
            />

            <div className="flex flex-wrap gap-2">
              {EXAMPLE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleExample(t(key))}
                  className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t(key)}
                </button>
              ))}
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                disabled={isPending || !message.trim()}
                className="cursor-pointer rounded-full px-5"
              >
                {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isPending ? t("submitting") : t("submit")}
              </Button>
            </div>
          </form>
        </div>

        {result?.type === "question" && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
              <MessageCircleQuestion className="size-4" />
            </span>
            <p className="pt-1.5 text-sm text-foreground">{t(`questions.${result.missingField}`)}</p>
          </div>
        )}

        {result?.type === "ready" && (
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                {result.events.length > 0 ? <Sparkles className="size-4" /> : <SearchX className="size-4" />}
              </span>
              <div className="flex min-w-0 flex-col gap-3">
                <p className="pt-1.5 text-sm text-foreground">
                  {result.events.length > 0
                    ? t("resultSummary", { count: result.events.length })
                    : t("noResults")}
                </p>

                {chips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {t("understoodAs")}
                    </span>
                    {chips.map((chip) => {
                      const Icon = CHIP_ICONS[chip.kind]
                      return (
                        <span
                          key={`${chip.kind}-${chip.value}`}
                          className="flex items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-foreground"
                        >
                          <Icon className="size-3.5" />
                          {chipLabel(chip)}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {result.events.length > 0 && (
              <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
                {result.events.map((event) => (
                  <UpcomingEventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

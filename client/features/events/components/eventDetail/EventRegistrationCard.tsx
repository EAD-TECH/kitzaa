"use client"

import { useState } from "react"
import { ArrowRight, Minus, Plus, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import type { AgeRange, EventDTO } from "../../types/event.types"
import { sortAgeRanges } from "../../utils/ageRange"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useJoinEvent } from "../../hooks/useJoinEvent"
import { useLeaveEvent } from "../../hooks/useLeaveEvent"
import { useTranslations } from "next-intl"
import { revalidateEventTag } from "../../actions/revalidateEvent"

const AGE_RANGE_SHORT_KEYS: Record<Exclude<AgeRange, "parents">, "ageShort0to3" | "ageShort4to6" | "ageShort7to10" | "ageShort10to14" | "ageShortAll"> = {
  "0-3": "ageShort0to3",
  "4-6": "ageShort4to6",
  "7-10": "ageShort7to10",
  "10-14": "ageShort10to14",
  "all-ages": "ageShortAll",
}

function getParticipantLabel(
  ageRanges: EventDTO["ageRanges"],
  t: (key: string, values?: Record<string, string>) => string,
) {
  const childRanges = sortAgeRanges(ageRanges ?? []).filter(
    (r): r is Exclude<AgeRange, "parents"> => r !== "parents"
  )
  const includesParents = ageRanges?.includes("parents") ?? false

  if (includesParents && childRanges.length === 0) return t("parentsOnly")
  // Hem ebeveyn hem çocuk gruplarına açık event'te tek bir kişi tipi yok.
  if (includesParents) return t("participants")
  if (childRanges.length === 0) return t("children")
  return t("childrenWithAges", {
    ages: childRanges.map((r) => t(AGE_RANGE_SHORT_KEYS[r])).join(", "),
  })
}

interface EventRegistrationCardProps {
  event: EventDTO
  onEventChange: (event: EventDTO) => void
}

const EventRegistrationCard = ({ event, onEventChange }: EventRegistrationCardProps) => {
  const t = useTranslations("Events")
  const common = useTranslations("Common")
  const participantLabel = getParticipantLabel(event.ageRanges, t)

  const { data: currentUser } = useCurrentUser()
  const isAuthReady = useAuthStore((state) => state.isReady)

  const freeSpots = Math.max(event.capacity.max - event.capacity.current, 0)
  const isFull = freeSpots === 0

  const isJoined = event.participantsPreview.some((p) => p._id === currentUser?._id)

  const [participantCount, setParticipantCount] = useState(1)

  const decrease = () => setParticipantCount((count) => Math.max(1, count - 1))
  const increase = () => setParticipantCount((count) => Math.min(freeSpots, count + 1))

  const price = event.isFree ? null : event.price
  const totalPrice = price ? price.amount * participantCount : 0

  const joinMutation = useJoinEvent(event._id)
  const leaveMutation = useLeaveEvent(event._id)
  const isPending = joinMutation.isPending || leaveMutation.isPending

  // Onaylanacak işlem dialog açılırken sabitlenir: başarıdan sonra isJoined hemen
  // değiştiği için içerik isJoined'a bağlı olsaydı kapanma animasyonunda metin atlardı.
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"join" | "leave">("join")

  const openConfirm = () => {
    // Giriş yapmamış kullanıcı onay modalına hiç ulaşmasın — backend zaten 401 döner.
    if (!currentUser) {
      // Kaydetme (EventCard / EventActions) ile aynı tür → giriş uyarıları hep aynı renkte.
      toast.error("Bitte melde dich an, um an diesem Event teilzunehmen.")
      return
    }
    setConfirmAction(isJoined ? "leave" : "join")
    setConfirmOpen(true)
  }

  // İstek sürerken dialog kapatılamaz; hata olursa açık kalır (toast hook'ta gösteriliyor).
  const handleConfirmOpenChange = (next: boolean) => {
    if (!isPending) setConfirmOpen(next)
  }

  const handleSuccess = (updatedEvent: EventDTO) => {
    onEventChange(updatedEvent)
    revalidateEventTag(event.slug)
    setConfirmOpen(false)
  }

  const handleConfirm = () => {
    if (confirmAction === "join") {
      joinMutation.mutate(participantCount, { onSuccess: (data) => handleSuccess(data.event) })
    } else {
      leaveMutation.mutate(undefined, { onSuccess: (data) => handleSuccess(data.event) })
    }
  }

  const isJoinConfirm = confirmAction === "join"


  return (
    <div className="order-3 flex w-full flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 tablet:col-span-2 tablet:mx-auto tablet:mt-10 tablet:max-w-xl desktop:order-1 desktop:mx-0 desktop:mt-0 desktop:max-w-none">
      <h2 className="font-heading text-base font-semibold text-foreground">{t("registration")}</h2>

      {price && (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {price.amount},00 €
          </span>
          <span className="text-sm text-muted-foreground">
            / {participantLabel}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <Users className="size-3.5" />
          {t("participantCount")}
        </span>

        <div className="flex items-center justify-between gap-3 rounded-full border border-border bg-input/30 py-1.5 pr-1.5 pl-3">
          <span className="text-sm text-foreground">
            {participantLabel}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isFull || isJoined || participantCount <= 1}
              onClick={decrease}
              aria-label={t("decreaseCount")}
              className="cursor-pointer"
            >
              <Minus className="size-3.5 cursor-pointer" />
            </Button>
            <span className="w-4 text-center text-sm font-semibold text-foreground">
              {participantCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isFull || isJoined || participantCount >= freeSpots}
              onClick={increase}
              aria-label={t("increaseCount")}
              className="cursor-pointer"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {price && (
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="font-medium text-foreground">{t("total")}</span>
          <span className="font-semibold text-foreground">
            {totalPrice} €
          </span>
        </div>
      )}

      <Button
        size="lg"
        className="w-full cursor-pointer"
        disabled={(isFull && !isJoined) || isPending || !isAuthReady}
        onClick={openConfirm}
        variant={isJoined ? "outline" : "default"}
      >
        {isFull && !isJoined
          ? t("soldOut")
          : isJoined
            ? t("cancelParticipation")
            : price
              ? t("bookNow")
              : t("joinFree")}
        {!isFull && !isJoined && <ArrowRight className="size-4" />}
      </Button>

      <span
        className={cn(
          "text-center text-xs font-medium",
          isFull ? "text-destructive" : "text-secondary"
        )}
      >
        {isFull
          ? t("noSpots")
          : t("spotsAvailable", { free: freeSpots, max: event.capacity.max })}
      </span>

      <AlertDialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isJoinConfirm ? t("confirmJoin") : t("confirmLeave")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isJoinConfirm ? (
                <>
                  {t("joinSummary", { count: participantCount, title: event.title })}
                  {price && t("joinPrice", { price: totalPrice })}
                </>
              ) : (
                t("leaveSummary", { title: event.title })
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="rounded-full">
              {common("cancel")}
            </AlertDialogCancel>
            {/* Katılma ve ayrılma aynı ana renkte (terracotta) — projeyle uyumlu; ne yapıldığını buton metni anlatıyor. */}
            <AlertDialogAction disabled={isPending} onClick={handleConfirm} className="rounded-full">
              {isJoinConfirm
                ? isPending ? t("joining") : t("confirmJoinAction")
                : isPending ? t("leaving") : t("cancelParticipation")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EventRegistrationCard

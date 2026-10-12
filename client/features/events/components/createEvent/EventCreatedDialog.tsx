"use client"

import { CircleAlert, CircleCheck, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { EventStatus } from "../../types/event.types"

// Backend'de status client'tan değil sunucudan belirleniyor: admin → "approved",
// diğerleri AI risk analizine göre "pending" / "approved" / "rejected". Modal metni
// bu yüzden her zaman "onay bekliyor" demiyor, dönen gerçek duruma göre değişiyor.
const CONTENT_STYLE: Partial<Record<EventStatus, { icon: typeof Clock; iconClassName: string; titleKey: "createdPendingTitle" | "createdApprovedTitle" | "createdRejectedTitle"; bodyKey: "createdPendingBody" | "createdApprovedBody" | "createdRejectedBody" }>> = {
  pending: {
    icon: Clock,
    iconClassName: "bg-primary/10 text-primary",
    titleKey: "createdPendingTitle",
    bodyKey: "createdPendingBody",
  },
  approved: {
    icon: CircleCheck,
    iconClassName: "bg-(--green-500)/15 text-[color-mix(in_oklch,var(--green-500),black_35%)]",
    titleKey: "createdApprovedTitle",
    bodyKey: "createdApprovedBody",
  },
  rejected: {
    icon: CircleAlert,
    iconClassName: "bg-destructive/10 text-destructive",
    titleKey: "createdRejectedTitle",
    bodyKey: "createdRejectedBody",
  },
}

interface EventCreatedDialogProps {
  status: EventStatus | null
  onClose: () => void
}

export function EventCreatedDialog({ status, onClose }: EventCreatedDialogProps) {
  const t = useTranslations("Events")
  const content = status ? (CONTENT_STYLE[status] ?? CONTENT_STYLE.pending!) : null
  const Icon = content?.icon

  return (
    // Modal nasıl kapatılırsa kapatılsın (buton, X, ESC, dışına tıklama) onClose
    // çağrılıyor — kullanıcı her durumda "Meine Events"e yönlendiriliyor.
    <Dialog open={!!status} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {content && Icon && (
          <>
            <DialogHeader className="items-center text-center">
              <div className={cn("mb-2 flex size-12 items-center justify-center rounded-full", content.iconClassName)}>
                <Icon className="size-6" />
              </div>
              <DialogTitle className="text-lg">{t(content.titleKey)}</DialogTitle>
              <DialogDescription>{t(content.bodyKey)}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="button" onClick={onClose} className="w-full rounded-full">
                {t("goToMyEvents")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

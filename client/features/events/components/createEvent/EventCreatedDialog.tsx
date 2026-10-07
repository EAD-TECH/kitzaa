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
import { cn } from "@/lib/utils"
import type { EventStatus } from "../../types/event.types"

// Backend'de status client'tan değil sunucudan belirleniyor: admin → "approved",
// diğerleri AI risk analizine göre "pending" / "approved" / "rejected". Modal metni
// bu yüzden her zaman "onay bekliyor" demiyor, dönen gerçek duruma göre değişiyor.
const CONTENT: Partial<Record<EventStatus, { icon: typeof Clock; iconClassName: string; title: string; description: string }>> = {
  pending: {
    icon: Clock,
    iconClassName: "bg-primary/10 text-primary",
    title: "Dein Event wurde erstellt!",
    description:
      "Vielen Dank! Dein Event wird jetzt von unserem Team geprüft. Sobald es freigegeben ist, benachrichtigen wir dich und es wird für alle sichtbar.",
  },
  approved: {
    icon: CircleCheck,
    iconClassName: "bg-(--green-500)/15 text-[color-mix(in_oklch,var(--green-500),black_35%)]",
    title: "Dein Event ist online!",
    description: "Dein Event wurde erstellt und ist ab sofort für alle sichtbar.",
  },
  rejected: {
    icon: CircleAlert,
    iconClassName: "bg-destructive/10 text-destructive",
    title: "Dein Event wurde erstellt",
    description:
      "Leider konnte dein Event nicht freigegeben werden. Unter „Meine Events“ kannst du es überarbeiten und erneut zur Prüfung einreichen.",
  },
}

interface EventCreatedDialogProps {
  status: EventStatus | null
  onClose: () => void
}

export function EventCreatedDialog({ status, onClose }: EventCreatedDialogProps) {
  const content = status ? (CONTENT[status] ?? CONTENT.pending!) : null
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
              <DialogTitle className="text-lg">{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="button" onClick={onClose} className="w-full rounded-full">
                Zu meinen Events
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

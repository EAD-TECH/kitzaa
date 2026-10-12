"use client"

import { useTranslations } from "next-intl"
import { Button } from '@/components/ui/button'

interface EventListErrorProps {
  onRetry?: () => void
}

export default function EventListError({ onRetry }: EventListErrorProps) {
  const t = useTranslations("Events")
  const common = useTranslations("Common")

  return (
    <div className='mt-12 flex flex-col items-center justify-center gap-4 py-20 text-center text-muted-foreground'>
      <p>{t("loadFailed")}</p>
      {onRetry && (
        <Button variant='outline' size='sm' onClick={onRetry}>
          {common("retry")}
        </Button>
      )}
    </div>
  )
}

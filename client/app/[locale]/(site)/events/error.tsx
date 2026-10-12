

'use client'

import { useTranslations } from 'next-intl'

interface ErrorPageProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
    const t = useTranslations("Events")
    const common = useTranslations("Common")

    return (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
            <p className='text-muted-foreground'>
                {error.message || t("loadFailed")}
            </p>
            <button
                onClick={() => reset()}
                className='rounded-md border px-4 py-2 text-sm hover:bg-muted'
            >
                {common("retry")}
            </button>
        </div>
    )
}

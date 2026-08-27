

'use client'

interface ErrorPageProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
    return (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
            <p className='text-muted-foreground'>
                Events konnten nicht geladen werden.
            </p>
            <button
                onClick={() => reset()}
                className='rounded-md border px-4 py-2 text-sm hover:bg-muted'
            >
                Erneut versuchen
            </button>
        </div>
    )
}

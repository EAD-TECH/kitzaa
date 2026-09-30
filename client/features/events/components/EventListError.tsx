import { Button } from '@/components/ui/button'

interface EventListErrorProps {
  onRetry?: () => void
}

export default function EventListError({ onRetry }: EventListErrorProps) {
  return (
    <div className='mt-12 flex flex-col items-center justify-center gap-4 py-20 text-center text-muted-foreground'>
      <p>Events konnten nicht geladen werden.</p>
      {onRetry && (
        <Button variant='outline' size='sm' onClick={onRetry}>
          Erneut versuchen
        </Button>
      )}
    </div>
  )
}

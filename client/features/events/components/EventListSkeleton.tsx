import { Skeleton } from '@/components/ui/skeleton'
import EventListRowSkeleton from './EventListRowSkeleton'
import { EVENT_LIST_CLASSNAME } from './EventList'

export default function EventListSkeleton() {
  return (
    <>
      <div className="mb-1 flex items-center gap-4">
        <Skeleton className="h-8 w-24 rounded-md bg-[oklch(0.92_0.015_85)]" />
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className={EVENT_LIST_CLASSNAME}>
        {Array.from({ length: 6 }).map((_, i) => (
          <EventListRowSkeleton key={i} />
        ))}
      </div>
    </>
  )
}
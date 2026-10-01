import EventListRowSkeleton from './EventListRowSkeleton'
import { EVENT_LIST_CLASSNAME } from './EventList'

export default function EventListSkeleton() {
  return (
    <div className={EVENT_LIST_CLASSNAME}>
      {Array.from({ length: 6 }).map((_, i) => (
        <EventListRowSkeleton key={i} />
      ))}
    </div>
  )
}
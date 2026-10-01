import CreateEventCard from '@/features/events/components/CreateEventCard'
import EventListSkeleton from '@/features/events/components/EventListSkeleton'
import FilterSidebarSkeleton from '@/features/events/components/filterSidebar/FilterSidebarSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='grid desktop:grid-cols-[280px_1fr_300px] gap-y-10 desktop:gap-y-8 gap-x-10 desktop:gap-x-14 px-6 tablet:px-20 desktop:px-10 mt-10 mx-auto'>
      <div className='hidden desktop:sticky desktop:top-20 desktop:row-span-2 desktop:block'>
        <FilterSidebarSkeleton />
      </div>

      <div className='desktop:col-start-2 desktop:col-span-2'>
        <Skeleton className='mt-2 h-11 w-full tablet:max-w-md' />
        <div className='mt-6 flex flex-wrap gap-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-24 rounded-4xl' />
          ))}
        </div>
      </div>

      <div className='desktop:col-start-2'>
        <EventListSkeleton />
      </div>

      <div className='hidden desktop:sticky desktop:top-20 desktop:col-start-3 desktop:block'>
        <CreateEventCard />
      </div>
    </div>
  )
}

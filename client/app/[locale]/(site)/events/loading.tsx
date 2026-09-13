import CreateEventCard from '@/features/events/components/CreateEventCard'
import EventListSkeleton from '@/features/events/components/EventListSkeleton'
import FilterSidebarSkeleton from '@/features/events/components/filterSidebar/FilterSidebarSkeleton'

export default function Loading() {
  return (
    <div className='grid desktop:grid-cols-[320px_1fr] gap-16 px-6 tablet:px-20 desktop:px-10 mt-10 mx-auto'>
      <div className='hidden desktop:flex flex-col gap-10'>
        <FilterSidebarSkeleton />
        <CreateEventCard />
      </div>
      <div>
        <EventListSkeleton />
      </div>
    </div>
  )
}

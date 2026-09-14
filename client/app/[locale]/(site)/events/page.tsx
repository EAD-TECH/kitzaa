
import FilterSidebar from '@/features/events/components/filterSidebar/FilterSidebar'
import EventCard from '@/features/events/components/EventCard'
import { EventSearch } from '@/features/events/components/EventSearch'
import CreateEventCard from '@/features/events/components/CreateEventCard'
import AgeFilter from '@/features/events/components/AgeFilter'

import EventSheet from '@/features/events/components/filterSidebar/EventSheet'
import EventList from '@/features/events/components/EventList'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Suspense } from 'react'
import EventListError from '@/features/events/components/EventListError'
import EventListSkeleton from '@/features/events/components/EventListSkeleton'
import FilterSidebarSkeleton from '@/features/events/components/filterSidebar/FilterSidebarSkeleton'
import ScrollToTopButton from '@/features/events/components/ScrollToTopButton'

interface EventsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const EventsPage = async ({ searchParams }: EventsPageProps) => {

  const params = await searchParams

  return (
    <div className='grid desktop:grid-cols-[280px_1fr_300px] gap-y-10 desktop:gap-y-8 gap-x-10 desktop:gap-x-14 px-6 tablet:px-20 desktop:px-10 mt-10 mx-auto'>
      <div className='hidden desktop:sticky desktop:top-20 desktop:row-span-2 desktop:block'>
        <Suspense fallback={<FilterSidebarSkeleton />}>
          <FilterSidebar />
        </Suspense>
      </div>

      <div>
        <div className='desktop:col-start-2 desktop:col-span-2'>
          <div className='mt-2 flex items-center gap-3'>
            <EventSearch />
            <EventSheet />
          </div>
          <AgeFilter />
        </div>

        <div
          id="event-list-scroll"
          className='desktop:col-start-2 desktop:h-[calc(100vh-0.5rem)] desktop:overflow-y-auto desktop:pr-2 scrollbar-subtle mt-12'
        >
          <ErrorBoundary fallback={<EventListError />}>
            <Suspense fallback={<EventListSkeleton />}>
              <EventList searchParams={params} />
            </Suspense>
          </ErrorBoundary>

          <div className='mt-25 desktop:mt-10 desktop:hidden'>
            <div className='mb-6 flex items-center gap-3 text-muted-foreground '>
              <span className='h-px flex-1 bg-border' />
              <span className='font-heading text-xs font-medium tracking-wide'>
                NICHTS GEFUNDEN?
              </span>
              <span className='h-px flex-1 bg-border' />
            </div>
            <CreateEventCard />
          </div>
        </div>
      </div>

      <div className='hidden desktop:sticky desktop:top-20 desktop:col-start-3 desktop:block mt-6'>
        <CreateEventCard />
      </div>

      <ScrollToTopButton scrollContainerId="event-list-scroll" />
    </div>
  )
}

export default EventsPage

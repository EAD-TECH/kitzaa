


import type { EventDTO } from '@/features/events/types/event.types'
import EventCard from './EventCard'
import { getEventsServer } from '../api/eventApi.server'
import LoadMoreEvents from './LoadMoreEvents'


interface EventListProps {
    searchParams: Record<string, string | string[] | undefined>
}

export const EVENT_GRID_CLASSNAME =
    'grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0'


const EventList = async ({ searchParams }: EventListProps) => {

    const { events, details } = await getEventsServer(searchParams)

    console.log(details)

    const nextPage =
        details.pages !== false && details.pages.next !== false
            ? details.pages.next
            : null



    return (
        <>
            <div className='mt-12 grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0 mb-15'>
                {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>
            <LoadMoreEvents initialNextPage={nextPage} />
        </>

    )
}

export default EventList
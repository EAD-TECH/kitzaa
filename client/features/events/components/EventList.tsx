


import type { EventDTO } from '@/features/events/types/event.types'
import EventListRow from './EventListRow'
import { getEventsServer } from '../api/eventApi.server'
import LoadMoreEvents from './LoadMoreEvents'
import { FadeInOnView } from '@/components/motion/FadeInOnView'


interface EventListProps {
    searchParams: Record<string, string | string[] | undefined>
}

export const EVENT_GRID_CLASSNAME =
    'grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0'

export const EVENT_LIST_CLASSNAME = 'flex flex-col desktop:max-w-270'


const EventList = async ({ searchParams }: EventListProps) => {

    const { events, details } = await getEventsServer(searchParams)

    console.log(details)

    const nextPage =
        details.pages !== false && details.pages.next !== false
            ? details.pages.next
            : null



    return (
        <>
            <div className={`mb-15 ${EVENT_LIST_CLASSNAME}`}>
                {events.map((event, index) => (
                    <FadeInOnView key={event._id} delay={(index % 4) * 100} duration={700}>
                        <EventListRow event={event} />
                    </FadeInOnView>
                ))}
            </div>
            <LoadMoreEvents initialNextPage={nextPage} />
        </>

    )
}

export default EventList
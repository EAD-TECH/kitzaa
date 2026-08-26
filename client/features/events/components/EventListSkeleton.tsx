import EventCardSkeleton from './EventCardSkeleton'

export default function EventListSkeleton() {
  return (
    <div className='mt-12 grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0'>
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PartyPopper, Tag } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { ApiError } from "@/lib/api/client"
import { getOrganizerEventCountServer, readEventServer } from "@/features/events/api/eventApi.server"
import EventActions from "@/features/events/components/eventDetail/EventActions"
import EventContent from "@/features/events/components/eventDetail/EventContent"
import EventInfo from "@/features/events/components/eventDetail/EventInfo"
import EventDetailSidebar from "@/features/events/components/eventDetail/EventDetailSidebar"
import Standort from "@/features/events/components/eventDetail/Standort"
import { Badge } from "@/components/ui/badge"

interface EventDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { slug } = await params

  const { event } = await readEventServer(slug)

  const organizerId = typeof event.createdBy === "string" ? event.createdBy : event.createdBy._id
  const organizerEventCount = await getOrganizerEventCountServer(organizerId)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 tablet:px-10">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/events" className="hover:text-foreground">
          Events
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{event.title}</span>
      </nav>

      <div className="grid gap-10 desktop:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="relative aspect-[5/2] w-full overflow-hidden rounded-2xl">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-linear-to-br from-secondary to-accent">
                <PartyPopper className="size-10 text-secondary-foreground/40" />
              </div>
            )}

         
              <Badge className="absolute top-3 left-3 gap-1 border-none bg-background/90 text-foreground shadow-sm">
                <Tag className="size-3" />
                {typeof event.categoryId === "string" ? null : event.categoryId.name}
              </Badge>

              <div className="absolute top-3 right-3">
                <EventActions event={event} />
              </div>
          </div>

          <h1 className="font-heading text-2xl font-semibold text-foreground tablet:text-3xl">
            {event.title}
          </h1>

          <EventInfo event={event} />

          <Separator />

          <EventContent description={event.description} />

          <Separator />

          <Standort location={event.location} />
        </div>

        <aside className="flex flex-col gap-6 tablet:grid tablet:grid-cols-2 desktop:flex desktop:flex-col desktop:sticky desktop:top-24 desktop:self-start">
          <EventDetailSidebar
            event={event}
            organizerCreatedBy={event.createdBy}
            organizerEventCount={organizerEventCount}
          />
        </aside>
      </div>
    </div>
  )
}

export default EventDetailPage

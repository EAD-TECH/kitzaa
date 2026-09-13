import { CreateEventWizard } from "@/features/events/components/createEvent/CreateEventWizard"
import { getCategoriesServer } from "@/features/events/api/categoryApi.server"

interface EventsBearbeitenPageProps {
  params: Promise<{ id: string }>
}

const EventsBearbeitenPage = async ({ params }: EventsBearbeitenPageProps) => {
  const { id } = await params
  const { categories } = await getCategoriesServer()

  return <CreateEventWizard categories={categories} eventId={id} />
}

export default EventsBearbeitenPage

import { EditEventWizard } from "@/features/events/components/createEvent/EditEventWizard"
import { getCategoriesServer } from "@/features/events/api/categoryApi.server"

interface EventsBearbeitenPageProps {
  params: Promise<{ id: string }>
}

const EventsBearbeitenPage = async ({ params }: EventsBearbeitenPageProps) => {
  const { id } = await params
  const { categories } = await getCategoriesServer()

  return <EditEventWizard eventId={id} categories={categories} />
}

export default EventsBearbeitenPage

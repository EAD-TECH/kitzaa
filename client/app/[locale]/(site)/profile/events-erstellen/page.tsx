import { CreateEventWizard } from "@/features/events/components/createEvent/CreateEventWizard"
import { getCategoriesServer } from "@/features/events/api/categoryApi.server"

const EventsErstellenPage = async () => {
  const { categories } = await getCategoriesServer()

  return <CreateEventWizard categories={categories} />
}

export default EventsErstellenPage

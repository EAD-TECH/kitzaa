import { getTranslations } from "next-intl/server"
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import FilterSidebar from './FilterSidebar'

const EventSheet = async () => {
  const t = await getTranslations("Events")

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" className="shrink-0 gap-2 desktop:hidden" />}
      >
        <SlidersHorizontal className="size-5 text-primary" />
        {t("filter")}
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetTitle className="sr-only">{t("filter")}</SheetTitle>
        <FilterSidebar />
      </SheetContent>
    </Sheet>
  )
}

export default EventSheet

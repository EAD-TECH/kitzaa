import React from 'react'
import { SlidersHorizontal } from 'lucide-react'
import CategoryFilter from './CategoryFilter'
import LocationTypeFilter from './LocationTypeFilter'
import OrganisatorFilter from './OrganisatorFilter'
import { DateRangeFilter } from './DateRangeFilter'
import LocationFilter from './LocationFilter'
import { getCategoriesServer } from '../../api/categoryApi.server'



const FilterSidebar = async () => {

    const { categories } = await getCategoriesServer()

    return (

        <aside className="flex w-full max-w-xs flex-col gap-8 rounded-lg  bg-sidebar p-7 text-sidebar-foreground">
            <p className='flex items-center gap-2 border-b border-border/60 pb-4 font-heading text-2xl font-semibold'>
                <SlidersHorizontal className="size-5 text-primary" />
                Filter
            </p>
            <CategoryFilter categories={categories} />
            <LocationTypeFilter />
            <OrganisatorFilter />
            <DateRangeFilter />
            <LocationFilter />
        </aside>

    )
}

export default FilterSidebar
"use client"

import React, { useState } from 'react'
import { Tag } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'

const CategoryFilter = () => {

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

 const categories : string[] = ["Natur", "Outdoor", "Musik", "Sport", "Bildung"]

  return (
    <div>
          <FilterCheckboxGroup
             name='category'
             title='KATEGORIEN'
             icon={<Tag className="size-3.5" />}
             options={categories}
             selected={selectedCategories}
             onChange={setSelectedCategories}
             />
    </div>
  )
}

export default CategoryFilter
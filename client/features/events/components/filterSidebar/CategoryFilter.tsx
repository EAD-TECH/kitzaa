"use client"

import React, { useState } from 'react'
import { Tag } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'
import type { EventCategoryDTO } from '../../types/eventCategory.types'

interface CategoryFilterProps {
  categories: EventCategoryDTO[]
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  const options = categories.map((category) => category.name)

  return (
    <div>
      <FilterCheckboxGroup
        name='category'
        title='KATEGORIEN'
        icon={<Tag className="size-3.5" />}
        options={options}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        columns={1}
      />
    </div>
  )
}

export default CategoryFilter

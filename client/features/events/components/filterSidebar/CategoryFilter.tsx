"use client"

import React, { useState } from 'react'
import { Tag } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'
import type { EventCategoryDTO } from '../../types/eventCategory.types'
import { useTranslations } from "next-intl"
import { useQueryParams } from '../../hooks/useQueryParams'

interface CategoryFilterProps {
  categories: EventCategoryDTO[]
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const t = useTranslations("Events")
  const options = categories.map((c) => ({ label: c.name, value: c.slug }))

  const { getAll, setParam } = useQueryParams()

  const selected = getAll("category")



  return (
    <div>
      <FilterCheckboxGroup
        name='category'
        title={t("categories")}
        icon={<Tag className="size-3.5" />}
        options={options}
        selected={selected}
        onChange={(slugs) => setParam("category", slugs)}
        columns={1}
      />
    </div>
  )
}

export default CategoryFilter

"use client"

import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'
import { useTranslations } from "next-intl"
import { useQueryParams } from '../../hooks/useQueryParams'

const LocationTypeFilter = () => {
  const t = useTranslations("Events")
  const locationTypes = [
    { label: t("indoor"), value: "indoor" },
    { label: t("outdoor"), value: "outdoor" },
    { label: t("online"), value: "online" },
  ]

  const { getAll, setParam } = useQueryParams()
  const selected = getAll('locationType')


  return (
    <div>
      <FilterCheckboxGroup
        name='locationType'
        title={t("place")}
        icon={<MapPin className="size-3.5" />}
        options={locationTypes}
        selected={selected}
        onChange={(values => setParam("locationType", values))}
      />
    </div>
  )
}

export default LocationTypeFilter

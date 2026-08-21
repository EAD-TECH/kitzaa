"use client"

import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'

const LocationTypeFilter = () => {

  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])

  const locationTypes: string[] = ["Drinnen", "Draußen", "Online"]

  return (
    <div>
      <FilterCheckboxGroup
        name='locationType'
        title='ORT'
        icon={<MapPin className="size-3.5" />}
        options={locationTypes}
        selected={selectedLocationTypes}
        onChange={setSelectedLocationTypes}
      />
    </div>
  )
}

export default LocationTypeFilter

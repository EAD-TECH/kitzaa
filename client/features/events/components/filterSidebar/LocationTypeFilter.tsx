"use client"

import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'
import { useQueryParams } from '../../hooks/useQueryParams'

const LOCATION_TYPES = [
  { label: 'Drinnen', value: 'indoor' },
  { label: 'Draußen', value: 'outdoor' },
  { label: 'Online', value: 'online' },
]


const LocationTypeFilter = () => {

  const { getAll, setParam } = useQueryParams()
  const selected = getAll('locationType')


  return (
    <div>
      <FilterCheckboxGroup
        name='locationType'
        title='ORT'
        icon={<MapPin className="size-3.5" />}
        options={LOCATION_TYPES}
        selected={selected}
        onChange={(values => setParam("locationType", values))}
      />
    </div>
  )
}

export default LocationTypeFilter

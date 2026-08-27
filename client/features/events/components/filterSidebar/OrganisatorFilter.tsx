"use client"

import React, { useState } from 'react'
import { Users } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'
import { useQueryParams } from '../../hooks/useQueryParams'

const ORGANISATION_TYPES = [
  { label: 'Organisationen', value: 'organizer' },
  { label: 'Privat', value: 'user' }
]


const OrganisatorFilter = () => {


    const {getAll, setParam} = useQueryParams()

    const selected = getAll("organisator")


    return (
        <div>
            <FilterCheckboxGroup
                name='organisator'
                title='ORGANISATOR'
                icon={<Users className="size-3.5" />}
                options={ORGANISATION_TYPES}
                selected={selected}
                onChange={value => setParam('organisator', value)}
            />
        </div>
    )
}

export default OrganisatorFilter
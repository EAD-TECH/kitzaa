"use client"

import React, { useState } from 'react'
import { Users } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'

const OrganisatorFilter = () => {

    const [selectedOrganisator, setSelectedOrganisator] = useState<string[]>([])

    const organisator: string[] = ["Organisationen", "Privat"]


    return (
        <div>
            <FilterCheckboxGroup
                name='organisator'
                title='ORGANISATOR'
                icon={<Users className="size-3.5" />}
                options={organisator}
                selected={selectedOrganisator}
                onChange={setSelectedOrganisator}
            />
        </div>
    )
}

export default OrganisatorFilter
"use client"

import React, { useState } from 'react'
import { Users } from 'lucide-react'
import { FilterCheckboxGroup } from './FilterCheckBoxGroup'
import { useTranslations } from "next-intl"
import { useQueryParams } from '../../hooks/useQueryParams'

const OrganisatorFilter = () => {
    const t = useTranslations("Events")
    const common = useTranslations("Common")
    const organisationTypes = [
      { label: t("organizations"), value: "organizer" },
      { label: common("private"), value: "user" },
    ]

    const {getAll, setParam} = useQueryParams()

    const selected = getAll("organisator")


    return (
        <div>
            <FilterCheckboxGroup
                name='organisator'
                title={t("organizer")}
                icon={<Users className="size-3.5" />}
                options={organisationTypes}
                selected={selected}
                onChange={value => setParam('organisator', value)}
            />
        </div>
    )
}

export default OrganisatorFilter
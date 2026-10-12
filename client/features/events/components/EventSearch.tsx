"use client"

import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryParams } from "../hooks/useQueryParams"

export function EventSearch() {
  const t = useTranslations("Events")
  const { getParam, setParam } = useQueryParams()
  const [value, setValue] = useState(() => getParam("search") ?? "")

  useEffect(() => {

    const timeout = setTimeout(() => {
      setParam("search", value)
    },400)

    return () => clearTimeout(timeout)

  }, [value])


  return (
    <InputGroup className="min-w-0 flex-1 tablet:max-w-md bg-background shadow-2xs">
      <InputGroupInput
        placeholder={t("searchPlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <InputGroupAddon >
        <Search className="text-primary " strokeWidth={2} />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end"></InputGroupAddon>
    </InputGroup>
  )
}

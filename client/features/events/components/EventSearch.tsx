import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function EventSearch() {
  return (
    <InputGroup className="min-w-0 flex-1 tablet:max-w-md bg-background shadow-2xs">
      <InputGroupInput placeholder="Suche nach Events, Workshops..." />
      <InputGroupAddon >
        <Search className="text-primary " strokeWidth={2} />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end"></InputGroupAddon>
    </InputGroup>
  )
}

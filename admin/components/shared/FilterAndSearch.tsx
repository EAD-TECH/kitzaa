import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ListFilter, SearchIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import type { FilterAndSearchProps } from "./types";

export default function FilterAndSearch({
  searchValue,
  onSearchChange,
  filterOptions,
  selectedValues,
  onFilterSelect,
}: FilterAndSearchProps) {
  return (
    <>
      {/* genel search alanım */}
      <InputGroup>
        <InputGroupInput
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      {/* filter dropdownlu kısm */}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="flex items-center border-dashed h-8"
            >
              <ListFilter className="mr-2 h-4 w-4 text-(--brown-500)" />
              <span>Filtrele</span>

              {selectedValues.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} seçili
                  </Badge>
                </>
              )}
            </Button>
          }
        />

        <PopoverContent className="w-50 p-0" align="start">
          {/* arama motoru bılesenı */}
          <Command>
            {/* liste cubugum */}
            <CommandInput placeholder="ara..." />

            {/* listele */}
            <CommandList>
              {/* search te bırsey cıkmazsa */}
              <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>

              {/*secenekleri grupluyorum */}
              <CommandGroup>
                {/* dınamık filter dongusu */}
                {filterOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onFilterSelect(option.value)}
                  >
                    {/*   <CircleDot className="text-(--brown-500)" /> */}

                    {option.icon && <span className="mr-2">{option.icon}</span>}

                    <span className="text-(--brown-500)">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

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
import { useState } from "react";

export default function FilterAndSearch({
  searchValue,
  onSearchChange,
  filterOptions,
  selectedValues,
  onFilterSelect,
}: FilterAndSearchProps) {
  const [aktifMenu, setAktifMenu] = useState<string | null>(null)

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-2 tablet:flex-1 tablet:w-auto">
      {/* genel search alanım */}
      <InputGroup className="w-full   focus-visible:ring-0 max-w-xs min-w-0 sm:max-w-sm">
        <InputGroupInput
          placeholder="Search..."
          value={searchValue} /* dinamik deger */
          onChange={(e) =>
            onSearchChange(e.target.value)
          } /* arama calıstıgında Panoya haber vereck */
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
              className="flex h-8 shrink-0 items-center border-dashed"
            >
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
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
              {!aktifMenu ? (
                <CommandGroup>
                  {/* dınamık filter dongusu */}
                  {filterOptions.map((kategori) => (
                    // CommandItem burada açılıyor...
                    <CommandItem
                      key={kategori.id}
                      onSelect={() => setAktifMenu(kategori.id)}
                    >
                      {kategori.icon && (
                        <span className="mr-2">{kategori.icon}</span>
                      )}
                      <span className="text-foreground">
                        {kategori.label}
                      </span>
                    </CommandItem>
                    
                  ))}
                </CommandGroup>
              ) : (
                <CommandGroup>
                  <CommandItem onSelect={() => setAktifMenu(null)}>
                    <span>Geri</span>
                  </CommandItem>
                  <Separator className="my-1" />

                  {filterOptions
                    .find((k) => k.id === aktifMenu)
                    ?.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => onFilterSelect(option.value)}
                      >
                        <span className="text-foreground">
                          {option.label}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

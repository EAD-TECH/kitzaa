

"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
    Field,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"

import { IoLocationOutline } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { MapPin } from "lucide-react";



const LocationFilter = () => {

    const [value, setValue] = useState(25)

    return (
        <FieldSet>
            <div className="flex items-center justify-between">
                <FieldLegend
                    variant="label"
                    className="mb-0 flex items-center gap-1.5 font-heading text-xs font-medium tracking-wide text-foreground uppercase"
                >
                    <MapPin className="size-3.5" />
                    ORT & ENTFERNUNG
                </FieldLegend>
                <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm text-muted-foreground">
                    <Input
                        id="slider-input"
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const v = Number(e.target.value)
                            if (v >= 1 && v <= 50) setValue(v)
                        }}
                        min={1}
                        max={50}
                        className="h-5 w-5 border-none bg-transparent p-0 text-right text-sm font-medium text-foreground tabular-nums focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span>km</span>
                </div>
            </div>
            <Field>
                <div className="relative">
                    <IoLocationOutline className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="input-field-location"
                        type="text"
                        placeholder="Stadt oder PLZ"
                        className="pr-9 pl-9"
                    />
                    <button
                        type="button"
                        aria-label="Aktuellen Standort verwenden"
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                        <MdMyLocation className="size-4" />
                    </button>
                </div>
            </Field>
            <div className="items-center text-xs text-muted-foreground">
                <Slider
                    value={[value]}
                    onValueChange={(val) =>
                        setValue(Array.isArray(val) ? (val[0] ?? value) : val)
                    }
                    min={1}
                    max={50}
                    step={1}
                />
                <div className="mt-2 flex justify-between">
                    <span>1 km</span>
                    <span>50 km</span>
                </div>

            </div>
        </FieldSet>
    )

}

export default LocationFilter
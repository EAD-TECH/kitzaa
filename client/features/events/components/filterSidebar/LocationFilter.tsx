"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
    Field,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"

import { IoLocationOutline } from "react-icons/io5"
import { MdMyLocation } from "react-icons/md"
import { MapPin, X } from "lucide-react"
import { useQueryParams } from "../../hooks/useQueryParams"

const LocationFilter = () => {
    const { getParam, setParam, setParams } = useQueryParams()

    const radius = Number(getParam("radius") ?? 25)
    const hasLocation = getParam("lat") !== null && getParam("lng") !== null

    const [cityInput, setCityInput] = useState("")
    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [liveRadius, setLiveRadius] = useState(radius)

    useEffect(() => {
        setLiveRadius(radius)
    }, [radius])

    // Şehir/PLZ yazınca -> debounce -> geocode et -> lat/lng/radius'u URL'e yaz
    useEffect(() => {
        if (!cityInput.trim()) return

        const timeout = setTimeout(async () => {
            setIsLocating(true)
            setLocationError(null)

            try {
                const res = await fetch(`/api/geocode?q=${encodeURIComponent(cityInput.trim())}`)
                const data = await res.json()

                if (!res.ok || typeof data.lat !== "number" || typeof data.lng !== "number") {
                    setLocationError("Ort nicht gefunden.")
                    return
                }

                setParams({
                    lat: String(data.lat),
                    lng: String(data.lng),
                    radius: String(radius),
                })
            } catch {
                setLocationError("Etwas ist schiefgelaufen.")
            } finally {
                setIsLocating(false)
            }
        }, 500)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityInput])

    const clearLocation = () => {
        setCityInput("")
        setLocationError(null)
        setParams({ lat: null, lng: null, radius: null })
    }

    const useCurrentLocation = (radiusOverride?: number) => {
        if (!navigator.geolocation) {
            setLocationError("Dein Browser unterstützt keine Standortermittlung.")
            return
        }

        setIsLocating(true)
        setLocationError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setCityInput("")
                setParams({
                    lat: String(latitude),
                    lng: String(longitude),
                    radius: String(radiusOverride ?? radius),
                })
                setIsLocating(false)
            },
            (error) => {
                setIsLocating(false)
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationError("Standortzugriff verweigert. Bitte Stadt oder PLZ eingeben.")
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setLocationError("Standort konnte nicht ermittelt werden.")
                } else {
                    setLocationError("Zeitüberschreitung bei der Standortermittlung.")
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
        )
    }

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
                        value={radius}
                        onChange={(e) => {
                            const v = Number(e.target.value)
                            if (v >= 1 && v <= 50) setParam("radius", String(v))
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
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        spellCheck={false}
                        autoCorrect="off"
                        className="pr-16 pl-9"
                    />
                    {(cityInput || hasLocation) && (
                        <button
                            type="button"
                            aria-label="Standort entfernen"
                            onClick={clearLocation}
                            className="absolute top-1/2 right-9 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        aria-label="Aktuellen Standort verwenden"
                        onClick={() => useCurrentLocation()}
                        disabled={isLocating}
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
                    >
                        <MdMyLocation className="size-4" />
                    </button>
                </div>
                {hasLocation && !cityInput && (
                    <p className="text-xs text-muted-foreground">Aktueller Standort wird verwendet.</p>
                )}
                {locationError && (
                    <p className="text-xs text-destructive">{locationError}</p>
                )}
            </Field>
            <div className="items-center text-xs text-muted-foreground">
                <Slider
                    value={[liveRadius]}
                    onValueChange={(val) => {
                        const next = Array.isArray(val) ? (val[0] ?? liveRadius) : val
                        setLiveRadius(next)
                    }}
                    onValueCommitted={(val) => {
                        const next = Array.isArray(val) ? (val[0] ?? liveRadius) : val
                        if (hasLocation || cityInput) {
                            setParam("radius", String(next))
                        } else {
                            useCurrentLocation(next)
                        }
                    }}
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

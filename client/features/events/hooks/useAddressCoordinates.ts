"use client"

import { useEffect, useRef, useState } from "react"
import { useWatch, type UseFormReturn } from "react-hook-form"
import type { CreateEventFormInput } from "../types/createEvent.types"

type GeocodeResultStatus = "found" | "not-found" | "failed"
export type GeocodeStatus = "idle" | "loading" | GeocodeResultStatus

// Koordinat sadece şehirden alınıyor (şehir merkezi). Sokak adresi Nominatim'de çoğu zaman
// bulunamıyordu (ör. "Wanderparkplatz Monrepos" gibi yer adları) ve formu kilitliyordu.
// Bilinçli bir ödünleşim: büyük şehirlerde event'in gerçek yeri merkeze birkaç km uzak olabilir.
// Şehir değişince (debounce ile) /api/geocode'u çağırır ve sonucu location.coordinates'e
// yazar. Düzenleme modunda da bir kez çalışır — böylece eski Berlin-varsayılanıyla
// kaydedilmiş event'ler düzenlenince otomatik düzelir.
export const useAddressCoordinates = (form: UseFormReturn<CreateEventFormInput>) => {
  const [city, coordinates] = useWatch({
    control: form.control,
    name: ["location.city", "location.coordinates"],
  })
  const query = city?.trim() || null

  // State değil ref: değiştiğinde render tetiklemesine gerek yok, sadece aynı şehir
  // için tekrar istek atmamak için.
  const lastGeocodedQuery = useRef<string | null>(null)
  // Sonucu hangi şehre ait olduğuyla birlikte tutuyoruz; "loading"/"idle" ayrıca state'e
  // yazılmıyor, aşağıda render sırasında türetiliyor (effect içinde senkron setState yok).
  const [result, setResult] = useState<{ query: string; status: GeocodeResultStatus } | null>(null)

  useEffect(() => {
    if (query === lastGeocodedQuery.current) return

    // Şehir değişti → eski koordinat artık bu şehre ait değil. Yenisi gelene kadar null;
    // böylece form eski/yanlış koordinatla gönderilemez.
    lastGeocodedQuery.current = null
    form.setValue("location.coordinates", null)

    if (!query) return

    // Kullanıcı yazmaya devam ederse geç gelen eski cevap yenisinin üstüne yazmasın.
    let isCancelled = false

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (isCancelled) return

        if (res.status === 404) {
          setResult({ query, status: "not-found" })
          return
        }
        if (!res.ok || typeof data.lat !== "number" || typeof data.lng !== "number") {
          setResult({ query, status: "failed" })
          return
        }

        lastGeocodedQuery.current = query
        form.setValue("location.coordinates", { lat: data.lat, lng: data.lng }, { shouldValidate: true })
        setResult({ query, status: "found" })
      } catch {
        if (!isCancelled) setResult({ query, status: "failed" })
      }
    }, 800)

    return () => {
      isCancelled = true
      clearTimeout(timeout)
    }
  }, [query, form])

  if (!query) return "idle"
  // Elimizdeki sonuç güncel şehre ait değilse, yenisi yolda demektir.
  if (result?.query !== query) return "loading"
  // "found" ancak form'da gerçekten koordinat varken gösterilir (şehir eski haline
  // döndürüldüyse koordinat null'lanmış ve yeni istek yolda olabilir).
  if (result.status === "found" && !coordinates) return "loading"
  return result.status
}

"use client"

import { catchError, type ErrorInfo } from "next/error"
import EventListError from "./EventListError"

// Next.js'in resmi hata sınırı API'si: redirect()/notFound() gibi framework hatalarını
// yakalamaz, retry() ise sunucu bileşenini yeniden fetch ederek render eder.
function EventListErrorFallback(_props: object, { retry }: ErrorInfo) {
  return <EventListError onRetry={retry} />
}

export default catchError(EventListErrorFallback)

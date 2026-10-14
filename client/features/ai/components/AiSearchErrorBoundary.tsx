"use client"

import { Component, type ReactNode } from "react"
import { useTranslations } from "next-intl"

interface AiSearchErrorBoundaryProps {
  children: ReactNode
}

interface AiSearchErrorBoundaryState {
  hasError: boolean
}

function AiSearchResultFallback() {
  const t = useTranslations("Events")

  return (
    <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
      {t("loadFailed")}
    </p>
  )
}

// Sonuç kartı render sırasında patlarsa hata bu sınırda kalır.
// Üstteki sayfa ve bellekteki oturum yenilenmeden ayakta durur.
export class AiSearchErrorBoundary extends Component<
  AiSearchErrorBoundaryProps,
  AiSearchErrorBoundaryState
> {
  state: AiSearchErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AiSearchErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <AiSearchResultFallback />
    }

    return this.props.children
  }
}

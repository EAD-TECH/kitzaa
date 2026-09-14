"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SCROLL_THRESHOLD = 400

interface ScrollToTopButtonProps {
  scrollContainerId?: string
}

const ScrollToTopButton = ({ scrollContainerId }: ScrollToTopButtonProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = scrollContainerId ? document.getElementById(scrollContainerId) : null

    const handleScroll = () => {
      const containerScrollY = container?.scrollTop ?? 0
      setVisible(window.scrollY > SCROLL_THRESHOLD || containerScrollY > SCROLL_THRESHOLD)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    container?.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      container?.removeEventListener("scroll", handleScroll)
    }
  }, [scrollContainerId])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (scrollContainerId) {
      document.getElementById(scrollContainerId)?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      onClick={scrollToTop}
      aria-label="Nach oben scrollen"
      className={cn(
        "fixed right-6 bottom-6 z-40 rounded-full shadow-lg transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="size-5" />
    </Button>
  )
}

export default ScrollToTopButton

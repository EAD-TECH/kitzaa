import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Zeichenzähler/Leer-Prüfung für Rich-Text-HTML — zählt nur sichtbaren Text, nicht Markup.
export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

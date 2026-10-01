"use server"

import { updateTag } from "next/cache"

export async function revalidateEventTag(slug: string) {
  updateTag(`event-${slug}`)
}

"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useQueryParams() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const getParam = useCallback(
        (key: string) => searchParams.get(key),
        [searchParams],
    )

    const getAll = useCallback(
        (key: string) => searchParams.getAll(key),
        [searchParams],
    )

    const setParam = useCallback(
        (key: string, value: string | string[] | null | undefined) => {
            const params = new URLSearchParams(searchParams.toString())

            params.delete(key)

            if (Array.isArray(value)) {
                value.filter(Boolean).forEach((v) => params.append(key, v))
            } else if (value) {
                params.set(key, value)
            }

            params.delete("page")

            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [pathname, router, searchParams],
    )

    const setParams = useCallback(
        (updates: Record<string, string | string[] | null | undefined>) => {
            const params = new URLSearchParams(searchParams.toString())

            for (const [key, value] of Object.entries(updates)) {
                params.delete(key)
                if (Array.isArray(value)) {
                    value.filter(Boolean).forEach((v) => params.append(key, v))
                } else if (value) {
                    params.set(key, value)
                }
            }

            params.delete("page")
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [pathname, router, searchParams],
    )


    return { searchParams, getParam, getAll, setParam, setParams}
}

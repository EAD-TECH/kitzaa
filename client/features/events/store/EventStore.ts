
import { create } from "zustand"
import type { savedEventsState } from "../types/event.types"

export const useEventsStore = create<savedEventsState>()((set) => ({
    savedEventIds: new Set(),


    setSavedEventIds: (ids) => set({ savedEventIds: new Set(ids) }), //  [...arr, item] ile new Set(oldSet) ayyni sey
    addSavedEventId: (id) =>
        set((state) => ({ savedEventIds: new Set(state.savedEventIds).add(id) })),
    removeSavedEventId: (id) =>
        set((state) => {
            const next = new Set(state.savedEventIds)
            next.delete(id)
            return { savedEventIds: next }
        }),
}))
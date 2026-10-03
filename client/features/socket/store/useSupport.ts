import { create } from "zustand";
import type { SupportStore } from "../types";

export const useSupport = create<SupportStore>((set) => ({
  supportRoomId: null,
  supportMessages: [],

  setSupportRoomId: (id) => set({ supportRoomId: id }),

  addSupportMessage: (message) =>
    set((state) => {
      if (state.supportMessages.some((item) => item.id === message.id)) {
        return state;
      }
      return {
        supportMessages: [...state.supportMessages, message],
      };
    }),

  clearSupportSession: () =>
    set({
      supportRoomId: null,
      supportMessages: [],
    }),
}));

import { create } from "zustand";
import type { LiveWidgetStore } from "../types";

export const useLiveWidgetStore = create<LiveWidgetStore>((set) => ({
  /* baslangıc degerlerım */
  activities: [],
  onlineUsers: [],
  chatMessages: [],
  isSocketConnected: false,

  /* eskı mesajları koruyorm ustune yenılerı ekledım */

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities],
    })),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setSocketStatus: (status) => set({
    isSocketConnected: status,
  }),
/* bu fonksıyon benım yesıl butonun */
  markActivityAsRead: (id) =>
    set((state) => ({
      activities:state.activities.map((item)=>(
        item.id===id ? {...item, isRead:true} : item
      ))

      
     
    })),
  clearActivities: () =>
    set({
      activities: [],
    }),
}));

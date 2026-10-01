import { create } from "zustand";
import type { LiveWidgetStore } from "../types";

export const useLiveWidgetStore = create<LiveWidgetStore>((set) => ({
  /* baslangıc degerlerım */
  activities: [],
  onlineUsers: [],
  chatMessages: [],
  isSocketConnected: false,
  selectedUser: null,
  activeConversationRoomId: null,
  /* eskı mesajları koruyorm ustune yenılerı ekledım */

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities],
    })),

  setActivities: (activitiesPayload) => {
    set({ activities: activitiesPayload });
  },
    
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),

  setSocketStatus: (status) =>
    set({
      isSocketConnected: status,
    }),
  setactiveConversationRoomId: (_id) =>
    set({
      activeConversationRoomId: _id,
    }),
  /* bu fonksıyon benım yesıl butonun */
  markActivityAsRead: (id) =>
    set((state) => ({
      activities: state.activities.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    })),
  clearActivities: () =>
    set({
      activities: [],
    }),
}));

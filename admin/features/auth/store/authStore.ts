import { create } from "zustand";
import { AuthTokenState } from "../types/authTypes";

export const useAuthStore = create<AuthTokenState>()((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  isReady: false,
  setIsReady: (value) => set({ isReady: value }),
}));

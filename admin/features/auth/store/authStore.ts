
import { create } from "zustand";
import { AuthTokenState, isSocketState } from "../types/authTypes"; 


export const useAuthStore = create<AuthTokenState & isSocketState>((set) => ({
  accessToken: null,
  isReady: false,
  isSocketConnected: false,
  
  setAccessToken: (token) => set({ accessToken: token }),
  setIsReady: (val) => set({ isReady: val }),
  setIsSocketConnected: (val) => set({ isSocketConnected: val }),
}));
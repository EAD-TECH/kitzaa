import { create } from 'zustand'
import { AuthTokenState } from '../types/authTypes'

export const useAuthStore = create<AuthTokenState>()(
    (set) => ({
        accessToken: null,
        setAccessToken: (accessToken) => set({ accessToken }),
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    }),
   {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },


) 

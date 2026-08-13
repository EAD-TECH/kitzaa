import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState } from '../types/authTypes'

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setSession: ( {accessToken, user}) => set({ accessToken, user }),

            clearSession: () => set({ accessToken: null, user: null }), 
        }),
        { name: "auth-storage" }
    )
)
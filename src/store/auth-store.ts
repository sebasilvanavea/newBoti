import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  setAuthInitialized: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAuthInitialized: false,
      user: null,
      setUser: (user) => set({ isAuthenticated: !!user, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      setAuthInitialized: () => set({ isAuthInitialized: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migración desde versión 0 a 1
          return {
            ...persistedState,
            isAuthInitialized: false
          };
        }
        return persistedState as AuthState;
      },
    }
  )
);
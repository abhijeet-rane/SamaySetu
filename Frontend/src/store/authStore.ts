import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  email: string;
  role: string;
  token: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      login: (user) => {
        localStorage.setItem('jwt_token', user.token);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('jwt_token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Restore authentication state on page load
        if (state?.user?.token) {
          localStorage.setItem('jwt_token', state.user.token);
        }
        // Mark as hydrated
        state?.setHasHydrated(true);
      },
    }
  )
);

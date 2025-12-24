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
  rememberMe: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (user: User, rememberMe?: boolean) => void;
  logout: () => void;
  setRememberMe: (remember: boolean) => void;
}

// Create a dynamic storage based on rememberMe preference
const createDynamicStorage = () => {
  return {
    getItem: (name: string) => {
      // Try localStorage first, then sessionStorage
      const localItem = localStorage.getItem(name);
      if (localItem) return localItem;
      return sessionStorage.getItem(name);
    },
    setItem: (name: string, value: string) => {
      // Get current rememberMe preference
      const authData = JSON.parse(value);
      const rememberMe = authData?.state?.rememberMe ?? true;
      
      if (rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name); // Clean up session storage
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name); // Clean up local storage
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    },
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      rememberMe: false, // Default to false for better security
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      login: (user, rememberMe = false) => {
        localStorage.setItem('jwt_token', user.token);
        set({ user, isAuthenticated: true, rememberMe });
      },
      logout: () => {
        localStorage.removeItem('jwt_token');
        sessionStorage.removeItem('jwt_token');
        set({ user: null, isAuthenticated: false, rememberMe: false });
      },
      setRememberMe: (remember) => {
        set({ rememberMe: remember });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createDynamicStorage()),
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

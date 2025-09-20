import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIStore {
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>;

  // Loading states
  globalLoading: boolean;

  // Ações
  addNotification: (notification: Omit<UIStore['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      notifications: [],
      globalLoading: false,

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto remove após duration (padrão 5s)
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      setGlobalLoading: (globalLoading) => set({ globalLoading }),
    }),
    { name: 'ui-store' }
  )
);

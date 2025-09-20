"use client";

import { useUIStore } from '~/stores/ui-store';

export function Notifications() {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm rounded-lg p-4 shadow-lg transition-all duration-300
            ${notification.type === 'success' && 'bg-green-600 text-white'}
            ${notification.type === 'error' && 'bg-red-600 text-white'}
            ${notification.type === 'warning' && 'bg-yellow-600 text-white'}
            ${notification.type === 'info' && 'bg-blue-600 text-white'}
          `}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

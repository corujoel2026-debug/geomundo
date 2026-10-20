import { useState, useEffect, useCallback, useRef } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
      onRegisteredSW(_swUrl, registration) {
        if (registration) {
          // Check for service worker updates periodically (every 30 mins)
          const interval = setInterval(() => {
            registration.update().catch(() => {});
          }, 30 * 60 * 1000);

          // Check on window focus as well
          const handleFocus = () => {
            registration.update().catch(() => {});
          };
          window.addEventListener('focus', handleFocus);

          return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
          };
        }
      },
      onRegisterError(error) {
        console.error('Service worker registration error:', error);
      },
    });

    updateSWRef.current = updateSW;
  }, []);

  const updateApp = useCallback(async () => {
    try {
      if (updateSWRef.current) {
        await updateSWRef.current(true);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error updating PWA service worker:', err);
      window.location.reload();
    }
  }, []);

  return {
    needRefresh,
    offlineReady,
    updateApp,
  };
}

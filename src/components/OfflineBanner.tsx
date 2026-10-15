import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Aviso de conexión"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-stone-900/95 dark:bg-stone-800/95 text-stone-100 border border-stone-700/80 shadow-lg backdrop-blur-xs text-xs font-mono animate-fadeIn"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
      <span className="text-[12px] font-sans">
        Modo sin conexión <span className="text-stone-400 font-mono text-[11px]">(datos en caché)</span>
      </span>
    </aside>
  );
};

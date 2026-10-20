import React, { useState } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { usePWAUpdate } from '../hooks/usePWAUpdate';

export const PWAUpdateNotification: React.FC = () => {
  const { needRefresh, updateApp } = usePWAUpdate();
  const [dismissed, setDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!needRefresh || dismissed) {
    return null;
  }

  const handleUpdate = async () => {
    setUpdating(true);
    await updateApp();
  };

  return (
    <aside
      role="alert"
      aria-live="polite"
      aria-label="Nueva versión disponible"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-3 p-3 sm:px-4 sm:py-2.5 rounded-xl bg-white/95 dark:bg-stone-900/95 text-stone-800 dark:text-stone-100 border border-emerald-300 dark:border-emerald-800 shadow-xl backdrop-blur-xs text-xs font-mono animate-fadeIn"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-sans font-medium text-stone-900 dark:text-stone-100">
          Hay una versión nueva
        </span>
      </div>

      <div className="flex items-center gap-2 pl-1 border-l border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={updating}
          title="Actualizar aplicación a la última versión"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${updating ? 'animate-spin' : ''}`} />
          <span>{updating ? 'Actualizando...' : 'Actualizar'}</span>
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          title="Descartar por ahora"
          aria-label="Cerrar aviso de actualización"
          className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

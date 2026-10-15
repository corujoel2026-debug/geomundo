import React, { useState, useRef } from 'react';
import { UserProgress } from '../types';
import { downloadProgressFile, parseAndValidateProgressJSON } from '../utils/progressAnalytics';
import { saveUserProgress } from '../utils/storage';
import {
  Settings,
  Download,
  Upload,
  Check,
  AlertCircle,
  AlertTriangle,
  X,
  Sun,
  Moon,
  FileText,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  theme,
  onToggleTheme,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<{
    data: UserProgress;
    fileName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      downloadProgressFile(progress);
      setSuccessMessage('Archivo de progreso descargado correctamente.');
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(`Error al exportar el archivo: ${err?.message || 'Error desconocido'}`);
      setSuccessMessage(null);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset file input value so selecting the same file again triggers onChange
    e.target.value = '';

    if (!file) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content || !content.trim()) {
        setErrorMessage('El archivo seleccionado está vacío.');
        return;
      }

      const result = parseAndValidateProgressJSON(content);
      if (!result.success || !result.data) {
        setErrorMessage(result.error || 'El archivo seleccionado no tiene un formato válido de progreso.');
        setPendingImport(null);
        return;
      }

      // Valid JSON: prepare warning modal before replacing
      setPendingImport({
        data: result.data,
        fileName: file.name,
      });
    };

    reader.onerror = () => {
      setErrorMessage('Error al leer el archivo desde el dispositivo.');
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;

    try {
      saveUserProgress(pendingImport.data);
      onUpdateProgress(pendingImport.data);
      setSuccessMessage(
        `¡Progreso importado con éxito! Se restauraron ${pendingImport.data.masteredIds.length} países dominados y tu racha de ${pendingImport.data.currentStreak} días.`
      );
      setErrorMessage(null);
      setPendingImport(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(`Error al guardar el progreso importado: ${err?.message || 'Error desconocido'}`);
    }
  };

  const handleCancelImport = () => {
    setPendingImport(null);
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            <div>
              <h2 className="text-xl font-serif font-normal text-stone-900 dark:text-stone-100">
                Ajustes
              </h2>
              <span className="text-[11px] font-mono text-stone-400 block">
                Copia de seguridad y configuración
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            title="Cerrar ajustes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="p-3.5 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-mono">{successMessage}</div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-200 ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 border border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-mono">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-200 ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* REPLACEMENT WARNING PROMPT (Shown when a valid file is chosen, before actually overwriting) */}
        {pendingImport && (
          <div className="p-4 border-2 border-amber-300 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/30 space-y-3.5 animate-fadeIn">
            <div className="flex items-start gap-2.5 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">
                  ¿Reemplazar el progreso actual?
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-1 leading-relaxed">
                  Esta acción <strong>sobrescribirá el avance</strong> que tienes guardado en este navegador con los datos del archivo <span className="font-mono font-medium">"{pendingImport.fileName}"</span>.
                </p>
              </div>
            </div>

            {/* Preview of data being imported vs current */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-white/80 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-800 text-[11px] font-mono text-stone-700 dark:text-stone-300">
              <div>
                <span className="text-stone-400 block uppercase text-[10px]">Archivo a restaurar</span>
                <span className="block font-semibold mt-0.5">
                  • {pendingImport.data.masteredIds.length} países dominados
                </span>
                <span className="block text-stone-500">
                  • {pendingImport.data.reviewIds.length} en repaso
                </span>
                <span className="block text-stone-500">
                  • Racha: {pendingImport.data.currentStreak} {pendingImport.data.currentStreak === 1 ? 'día' : 'días'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block uppercase text-[10px]">Progreso actual</span>
                <span className="block font-medium mt-0.5">
                  • {progress.masteredIds.length} países dominados
                </span>
                <span className="block text-stone-500">
                  • {progress.reviewIds.length} en repaso
                </span>
                <span className="block text-stone-500">
                  • Racha: {progress.currentStreak} {progress.currentStreak === 1 ? 'día' : 'días'}
                </span>
              </div>
            </div>

            {/* Decision buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCancelImport}
                className="px-3.5 py-1.5 text-xs font-mono uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Sí, reemplazar y restaurar
              </button>
            </div>
          </div>
        )}

        {/* SECTION: DATA EXPORT & IMPORT */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
            Copia de seguridad y datos
          </span>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Descarga una copia completa de tu avance (países dominados, programación de repasos espaciados, racha de días, puntajes y estadísticas) o restaura un archivo previo.
          </p>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelected}
            className="hidden"
          />

          {/* The two required buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-mono uppercase tracking-wider font-medium transition-all"
            >
              <Download className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span>Exportar progreso</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Importar progreso</span>
            </button>
          </div>
        </div>

        {/* SECTION: THEME */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
              Tema visual
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              {theme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>Modo claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Modo oscuro</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useRef } from 'react';
import { Country, UserProgress } from '../types';
import { TOTAL_COUNTRIES_COUNT } from '../data/countries';
import { resetAllProgress, saveUserProgress } from '../utils/storage';
import { getLeitnerDistribution } from '../utils/sm2';
import {
  getContinentAccuracyStats,
  getMostFailedCountries,
  getWeeklyActivitySummary,
  downloadProgressFile,
  parseAndValidateProgressJSON,
} from '../utils/progressAnalytics';
import { Download, Upload, Copy, Check, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { getFlagUrl } from '../utils/flags';

interface ProgressDashboardProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectContinent: (c: any) => void;
  onOpenDetails?: (country: Country) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onUpdateProgress,
  onSelectContinent,
  onOpenDetails,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<UserProgress | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalMastered = progress.masteredIds.length;
  const globalPercent = Math.round((totalMastered / TOTAL_COUNTRIES_COUNT) * 100);
  const leitnerDist = useMemo(() => getLeitnerDistribution(progress), [progress]);
  const continentStats = useMemo(() => getContinentAccuracyStats(progress), [progress]);
  const failedCountries = useMemo(() => getMostFailedCountries(progress, 8), [progress]);
  const weeklySummary = useMemo(() => getWeeklyActivitySummary(progress), [progress]);

  const accuracy =
    progress.totalQuestionsAnswered > 0
      ? Math.round(
          (progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100
        )
      : 0;

  const handleReset = () => {
    const fresh = resetAllProgress();
    onUpdateProgress(fresh);
    setShowConfirmReset(false);
  };

  const handleCopyJSON = () => {
    try {
      const payload = {
        app: 'GeoMundo',
        version: '1.0',
        exportDate: new Date().toISOString(),
        progress,
      };
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      validateInputJson(content);
    };
    reader.readAsText(file);
  };

  const validateInputJson = (raw: string) => {
    setImportError(null);
    setImportPreview(null);

    if (!raw.trim()) return;

    const res = parseAndValidateProgressJSON(raw);
    if (res.success && res.data) {
      setImportPreview(res.data);
    } else {
      setImportError(res.error || 'Formato de archivo inválido.');
    }
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;

    saveUserProgress(importPreview);
    onUpdateProgress(importPreview);
    setShowImportModal(false);
    setImportJsonText('');
    setImportPreview(null);
    setImportError(null);
    setImportSuccessMessage('¡Progreso importado con éxito!');
    setTimeout(() => setImportSuccessMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
            Registro de Progreso & Estadísticas
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Análisis de precisión territorial, curvas de retención y control de datos
          </p>
        </div>

        {/* Quick Export/Import Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => downloadProgressFile(progress)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-700 dark:text-stone-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar progreso</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowImportModal(true);
              setImportError(null);
              setImportPreview(null);
              setImportJsonText('');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar progreso</span>
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {importSuccessMessage && (
        <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between animate-fadeIn text-xs font-mono text-stone-800 dark:text-stone-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{importSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportSuccessMessage(null)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
            Estados dominados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light font-mono text-stone-900 dark:text-stone-100">
              {totalMastered}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              / {TOTAL_COUNTRIES_COUNT}
            </span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block font-mono">
            {globalPercent}% del catálogo mundial
          </span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
            En cola de refuerzo
          </span>
          <span className="text-4xl font-light font-mono text-stone-900 dark:text-stone-100">
            {progress.reviewIds.length}
          </span>
          <span className="text-xs text-stone-500 mt-1 block">
            Países pendientes de afianzar
          </span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
            Precisión global
          </span>
          <span className="text-4xl font-light font-mono text-stone-900 dark:text-stone-100">
            {accuracy}%
          </span>
          <span className="text-xs text-stone-500 mt-1 block font-mono">
            {progress.totalCorrectAnswers}/{progress.totalQuestionsAnswered} respuestas
          </span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
            Racha de días
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light font-mono text-stone-900 dark:text-stone-100">
              {progress.currentStreak}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {progress.currentStreak === 1 ? 'día' : 'días'}
            </span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block font-mono">
            Mejor racha: {progress.bestStreak || 1} {progress.bestStreak === 1 ? 'día' : 'días'}
          </span>
        </div>
      </div>

      {/* Global rule */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
          <span>Progreso total de memorización</span>
          <span>{globalPercent}%</span>
        </div>
        <div className="h-0.5 w-full bg-stone-100 dark:bg-stone-800">
          <div
            className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-500"
            style={{ width: `${globalPercent}%` }}
          />
        </div>
      </div>

      {/* RACHA & GRÁFICO SEMANAL */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h3 className="text-lg font-serif font-normal text-stone-900 dark:text-stone-100">
              Racha & Actividad Semanal
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Preguntas y tarjetas respondidas en los últimos 7 días
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-stone-500">
            <div>
              <span>Semana: </span>
              <strong className="font-medium text-stone-900 dark:text-stone-100">
                {weeklySummary.weeklyTotal}
              </strong>
            </div>
            <div>
              <span>Media diaria: </span>
              <strong className="font-medium text-stone-900 dark:text-stone-100">
                {weeklySummary.dailyAverage}
              </strong>
            </div>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8">
          <div className="grid grid-cols-7 gap-2 sm:gap-6 items-end h-44 pt-6 pb-2 border-b border-stone-100 dark:border-stone-800">
            {weeklySummary.days.map((d) => {
              const heightPercent =
                weeklySummary.maxDailyCount > 0
                  ? Math.max(6, Math.round((d.count / weeklySummary.maxDailyCount) * 100))
                  : 6;

              return (
                <div key={d.dateStr} className="flex flex-col items-center h-full justify-end group">
                  {/* Count indicator on hover or value */}
                  <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 mb-2 tabular-nums">
                    {d.count > 0 ? d.count : '0'}
                  </span>

                  {/* Vertical bar */}
                  <div className="w-full max-w-[36px] bg-stone-100 dark:bg-stone-800 h-full flex items-end">
                    <div
                      className={`w-full transition-all duration-500 ${
                        d.isToday
                          ? 'bg-stone-900 dark:bg-stone-100'
                          : d.count > 0
                          ? 'bg-stone-400 dark:bg-stone-600 group-hover:bg-stone-600'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${d.count > 0 ? heightPercent : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-2 sm:gap-6 mt-3 text-center">
            {weeklySummary.days.map((d) => (
              <div key={d.dateStr}>
                <span
                  className={`block text-[11px] font-mono ${
                    d.isToday
                      ? 'font-bold text-stone-900 dark:text-stone-100 underline underline-offset-4'
                      : 'text-stone-400'
                  }`}
                >
                  {d.weekday}
                </span>
                <span className="block text-[10px] text-stone-400 mt-0.5">
                  {d.dateStr.split('-')[2]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL DE PRECISIÓN POR CONTINENTE */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-lg font-serif font-normal text-stone-900 dark:text-stone-100">
              Precisión por Continente
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Tasa de acierto y consolidación territorial desglosada por región
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400">
            5 continentes evaluados
          </span>
        </div>

        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800">
          {continentStats.map((item) => (
            <div
              key={item.continent}
              onClick={() => onSelectContinent(item.continent)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-900/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.accentColor }}
                />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-medium text-stone-900 dark:text-stone-100 hover:underline">
                      {item.continent}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      ({item.masteredCount} de {item.totalCountries} dominados)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-stone-500 mt-1">
                    <span>
                      Intentos: {item.totalQuestions}
                    </span>
                    <span>·</span>
                    <span>
                      Aciertos: {item.correctAnswers}
                    </span>
                    <span>·</span>
                    <span>
                      Fallos: {item.wrongAnswers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accuracy bar and percentage */}
              <div className="flex items-center gap-6 justify-between sm:justify-end">
                <div className="space-y-1.5 w-36 sm:w-44">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>Precisión</span>
                    <span className="text-stone-900 dark:text-stone-100 font-medium">
                      {item.accuracy !== null ? `${item.accuracy}%` : 'Sin datos'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${item.accuracy !== null ? item.accuracy : 0}%`,
                        backgroundColor: item.accentColor,
                      }}
                    />
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-700 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAÍSES MÁS FALLADOS */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-lg font-serif font-normal text-stone-900 dark:text-stone-100">
              Países con Mayor Número de Fallos
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Estados que requieren refuerzo prioritario según tus registros de estudio
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400">
            {failedCountries.length} detectados
          </span>
        </div>

        {failedCountries.length === 0 ? (
          <div className="p-8 border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/20 text-center">
            <span className="text-sm text-stone-600 dark:text-stone-400 font-normal">
              No se han registrado fallos todavía. Completa sesiones de tarjetas, cuestionarios o mapa mudo para visualizar las áreas de refuerzo.
            </span>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800">
            {failedCountries.map((item) => (
              <div
                key={item.country.id}
                onClick={() => onOpenDetails?.(item.country)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-900/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-6 border border-stone-200 dark:border-stone-700 bg-stone-100 shrink-0 overflow-hidden">
                    <img
                      src={getFlagUrl(item.country, 160)}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100 hover:underline">
                        {item.country.name}
                      </span>
                      <span className="text-xs text-stone-400">
                        ({item.country.capital})
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">
                      {item.country.continent}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right font-mono text-xs">
                  <div>
                    <span className="text-red-600 dark:text-red-400 font-medium block">
                      {item.wrongCount} {item.wrongCount === 1 ? 'fallo' : 'fallos'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {item.accuracy}% acierto ({item.correctCount}/{item.totalAttempts})
                    </span>
                  </div>

                  {item.inReview ? (
                    <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400">
                      En revisión
                    </span>
                  ) : item.leitnerBox ? (
                    <span className="hidden sm:inline-block text-[10px] text-stone-400">
                      Caja {item.leitnerBox}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SM-2 & Cajas de Leitner */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-normal text-stone-900 dark:text-stone-100">
            Distribución SM-2 & Cajas de Leitner
          </h3>
          <span className="text-xs font-mono text-stone-400">
            Intervalos programados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              Caja 1 · Diario
            </span>
            <span className="text-2xl font-light font-mono text-stone-900 dark:text-stone-100">
              {leitnerDist.box1}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Repaso cada 1 d</span>
          </div>

          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              Caja 2 · Corto
            </span>
            <span className="text-2xl font-light font-mono text-stone-900 dark:text-stone-100">
              {leitnerDist.box2}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Cada 2–3 días</span>
          </div>

          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              Caja 3 · Medio
            </span>
            <span className="text-2xl font-light font-mono text-stone-900 dark:text-stone-100">
              {leitnerDist.box3}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Cada ~1 semana</span>
          </div>

          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              Caja 4 · Largo
            </span>
            <span className="text-2xl font-light font-mono text-stone-900 dark:text-stone-100">
              {leitnerDist.box4}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Cada ~3 semanas</span>
          </div>

          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              Caja 5 · Consolidado
            </span>
            <span className="text-2xl font-light font-mono text-stone-900 dark:text-stone-100">
              {leitnerDist.box5}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">&gt; 1 mes</span>
          </div>
        </div>
      </div>

      {/* EXPORT / IMPORT SECTION */}
      <div className="border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h3 className="text-base font-serif font-normal text-stone-900 dark:text-stone-100">
              Ajustes de Datos y Copia de Seguridad
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Guarda tus países dominados, rachas y cajas de Leitner en un archivo JSON para sincronizar entre dispositivos.
            </p>
          </div>

          <span className="text-xs font-mono text-stone-400">
            JSON estándar
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => downloadProgressFile(progress)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar progreso</span>
          </button>

          <button
            type="button"
            onClick={handleCopyJSON}
            className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-800 dark:text-stone-200 transition-colors"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotification ? 'Copiado al portapapeles' : 'Copiar JSON'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowImportModal(true);
              setImportError(null);
              setImportPreview(null);
              setImportJsonText('');
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-800 dark:text-stone-200 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar progreso</span>
          </button>
        </div>
      </div>

      {/* RESET & STORAGE FOOTER */}
      <div className="pt-8 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
        <div>
          <span>Datos almacenados localmente en su navegador (localStorage)</span>
        </div>

        {!showConfirmReset ? (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="hover:underline text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            Restablecer progreso
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-stone-600">¿Confirmar reinicio de todos los datos?</span>
            <button
              type="button"
              onClick={handleReset}
              className="font-medium underline text-red-600 dark:text-red-400 hover:opacity-80"
            >
              Sí, reiniciar
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="text-stone-400 hover:underline"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* IMPORT JSON MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-baseline justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-xl font-serif font-normal text-stone-900 dark:text-stone-100">
                Importar Progreso en JSON
              </h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              Selecciona un archivo descargado previamente o pega el contenido JSON en el área de texto.
            </p>

            {/* File upload input */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-xs font-mono text-stone-600 dark:text-stone-300 flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-stone-400" />
                <span>Elegir archivo .json desde tu equipo</span>
              </button>
            </div>

            {/* Textarea for JSON paste */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-stone-400 block">
                O pega el texto JSON:
              </label>
              <textarea
                rows={5}
                value={importJsonText}
                onChange={(e) => {
                  setImportJsonText(e.target.value);
                  validateInputJson(e.target.value);
                }}
                placeholder='{"masteredIds": [...], "studyStats": {...}}'
                className="w-full p-3 font-mono text-xs border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
              />
            </div>

            {/* Error message */}
            {importError && (
              <div className="p-3 border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            {/* Warning before replacing and Preview of valid JSON */}
            {importPreview && (
              <div className="p-4 border border-amber-300 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/30 text-xs font-mono space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-semibold block">Aviso: Se va a reemplazar el progreso actual</span>
                    <span className="text-amber-700 dark:text-amber-300/90 text-[11px] block mt-0.5 leading-relaxed">
                      Al pulsar "Confirmar y Restaurar", se sobrescribirán los datos locales de este navegador con el avance del archivo:
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200 dark:border-amber-800/60 text-stone-700 dark:text-stone-300">
                  <div>• Países dominados: <strong>{importPreview.masteredIds.length}</strong></div>
                  <div>• En revisión: <strong>{importPreview.reviewIds.length}</strong></div>
                  <div>• Racha registrada: <strong>{importPreview.currentStreak} días</strong></div>
                  <div>• Respuestas totales: <strong>{importPreview.totalQuestionsAnswered}</strong></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-mono uppercase text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!importPreview}
                onClick={handleConfirmImport}
                className="px-6 py-2 text-xs font-mono uppercase tracking-wider font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Confirmar y Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

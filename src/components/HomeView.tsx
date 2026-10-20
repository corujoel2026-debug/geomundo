import React from 'react';
import { UserProgress, Continent, AppExperienceMode } from '../types';
import { TOTAL_COUNTRIES_COUNT } from '../data/countries';
import { CONTINENTS_LIST, CONTINENTS_META } from '../data/continents';
import { EspacioPublicitario } from './EspacioPublicitario';
import {
  Sparkles,
  Compass,
  Layers,
  BrainCircuit,
  Eye,
  CalendarClock,
  ArrowRight,
  Flame,
  Award,
  Globe2,
  BookOpen,
  MapPin,
  HelpCircle,
} from 'lucide-react';

interface HomeViewProps {
  progress: UserProgress;
  experienceMode: AppExperienceMode;
  onStartPractice: () => void;
  onExploreContinents: (continent?: Continent) => void;
  onStartQuiz?: () => void;
  onStartFlashcards?: () => void;
  onStartMapGame?: () => void;
  onOpenOnboarding?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  experienceMode,
  onStartPractice,
  onExploreContinents,
  onStartQuiz,
  onStartFlashcards,
  onStartMapGame,
  onOpenOnboarding,
}) => {
  const masteredCount = progress.masteredIds.length;
  const percentage = Math.round((masteredCount / TOTAL_COUNTRIES_COUNT) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16 space-y-16">
      {/* ESPACIO PUBLICITARIO (INICIO SUPERIOR - invisible por ahora) */}
      <EspacioPublicitario position="inicio" id="ad-home-header" />

      {/* HERO SECTION */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-600 dark:text-stone-300">
          <Globe2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Atlas pedagógico y memorización geográfica</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          Aprende y domina los 197 países del mundo
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
          GeoMundo es tu atlas interactivo para memorizar capitales, banderas y ubicaciones geográficas exactas. Diseñado con técnicas científicas de recuerdo activo y repetición espaciada para que cada país quede grabado de forma definitiva.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={onStartPractice}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-5 h-5" />
            <span>Comenzar práctica guiada</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          <button
            type="button"
            onClick={() => onExploreContinents()}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5" />
            <span>Explorar continentes</span>
          </button>
        </div>

        {onOpenOnboarding && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 inline-flex items-center gap-1.5 transition-colors underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Cómo funciona el método de GeoMundo? Ver guía</span>
            </button>
          </div>
        )}
      </div>

      {/* SNAPSHOT METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 font-mono">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
            Países dominados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-stone-900 dark:text-stone-100">
              {masteredCount}
            </span>
            <span className="text-xs text-stone-400">/ {TOTAL_COUNTRIES_COUNT}</span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">
            {percentage}% del mundo
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
            Racha de estudio
          </span>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-3xl font-light text-stone-900 dark:text-stone-100">
              {progress.currentStreak}
            </span>
          </div>
          <span className="text-xs text-stone-500 block">
            {progress.currentStreak === 1 ? 'Día consecutivo' : 'Días consecutivos'}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
            Preguntas acertadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-stone-900 dark:text-stone-100">
              {progress.totalCorrectAnswers || 0}
            </span>
          </div>
          <span className="text-xs text-stone-500 block">
            De {progress.totalQuestionsAnswered || 0} respondidas
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
            Modo activo
          </span>
          <div className="text-xl font-medium text-stone-900 dark:text-stone-100 truncate pt-1">
            {experienceMode === 'simple' ? 'Modo Simple' : 'Modo Avanzado'}
          </div>
          <span className="text-xs text-stone-500 block">
            {experienceMode === 'simple' ? 'Sesiones guiadas 10p' : 'Atlas completo y SM-2'}
          </span>
        </div>
      </div>

      {/* CONSEJOS PARA MEMORIZAR GEOGRAFÍA (3-4 Consejos clave) */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block">
            Estrategia de estudio
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 dark:text-stone-100">
            4 Consejos para memorizar geografía eficazmente
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Aplica estas técnicas respaldadas por la ciencia cognitiva para aprender más rápido y no olvidar lo memorizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consejo 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Consejo 1 · Chunking
                </span>
                <h3 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Divide el mundo en bloques manejables
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              No intentes memorizar los 197 países al mismo tiempo. Empieza dominando una sola región o continente delimitado (por ejemplo, los países de Centroamérica o Europa Occidental). Cuando alcances un 90% de aciertos en ese bloque, avanza a la siguiente zona geográfica.
            </p>
          </div>

          {/* Consejo 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Consejo 2 · Mnemotecnias
                </span>
                <h3 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Asocia siluetas y símbolos visuales
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Relaciona el contorno territorial con formas familiares: la bota de Italia, el triángulo de la India o el zapato de Noruega. Para las banderas, fíjate en detalles singulares (el árbol del Líbano, el sol de Argentina o la rueda de la India) y asócialos con el nombre de su capital.
            </p>
          </div>

          {/* Consejo 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Consejo 3 · Active Recall
                </span>
                <h3 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Prueba tu recuerdo antes de mirar
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Al ver un país en el mapa o una bandera, esfuérzate durante al menos 3 a 5 segundos en recordar el nombre o su capital antes de voltear la tarjeta o comprobar la solución. Ese esfuerzo de recuperación mental activa es lo que consolida los circuitos neuronales duraderos.
            </p>
          </div>

          {/* Consejo 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Consejo 4 · Espaciado
                </span>
                <h3 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Sesiones breves pero constantes cada día
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              5 a 10 minutos al día superan con creces una maratón de 2 horas los fines de semana. La repetición regular refresca la memoria justo cuando está a punto de desvanecerse, permitiendo retener países difíciles sin saturarte.
            </p>
          </div>
        </div>
      </div>

      {/* EXPLORAR POR CONTINENTES */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
              Continentes del mundo
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Accede a cada región para estudiar banderas, capitales y fichas geográficas
            </p>
          </div>
          <button
            type="button"
            onClick={() => onExploreContinents()}
            className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CONTINENTS_LIST.map((cont) => {
            const meta = CONTINENTS_META[cont];
            return (
              <button
                key={cont}
                type="button"
                onClick={() => onExploreContinents(cont)}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="text-xs font-mono text-stone-400 mb-2">
                  {meta.countryCount} países
                </div>
                <h4 className="font-serif font-semibold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cont}
                </h4>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                  {meta.curiosity}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ESPACIO PUBLICITARIO (INICIO INFERIOR - invisible por ahora) */}
      <EspacioPublicitario position="inicio" id="ad-home-footer" />
    </div>
  );
};

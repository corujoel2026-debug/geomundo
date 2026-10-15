import React, { useState } from 'react';
import { Globe2, Layers, Sparkles, ChevronRight, ChevronLeft, X, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartPractice,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Paso 1 de 3',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-inner">
          <Globe2 className="w-9 h-9" />
        </div>
      ),
      title: '¡Te damos la bienvenida a GeoMundo!',
      subtitle: 'Aprender los países, capitales y banderas del mundo es ahora fácil y entretenido para cualquier persona.',
      features: [
        {
          emoji: '🌍',
          title: 'Para todas las edades',
          desc: 'Diseñado para niños, jóvenes y adultos, con letras grandes y explicaciones claras.',
        },
        {
          emoji: '🧭',
          title: 'Organizado por continentes',
          desc: 'Explora América, Europa, África, Asia y Oceanía paso a paso, a tu propio ritmo.',
        },
        {
          emoji: '✨',
          title: 'Sin complicaciones',
          desc: 'Todo está listo para empezar de inmediato con un solo toque.',
        },
      ],
    },
    {
      badge: 'Paso 2 de 3',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-inner">
          <Layers className="w-9 h-9" />
        </div>
      ),
      title: 'Cómo practicar',
      subtitle: 'En cada sesión practicarás 10 países con tarjetas y preguntas fáciles de opción múltiple.',
      features: [
        {
          emoji: '🃏',
          title: 'Tarjetas con solo 2 botones',
          desc: 'Mira la bandera y capital. Solo presiona «Lo sé» si la recuerdas, o «Repasar» para volver a verla.',
        },
        {
          emoji: '🎯',
          title: 'Preguntas de opción múltiple',
          desc: 'Toca la opción correcta entre botones grandes y legibles. Si dudas, te mostramos la solución.',
        },
        {
          emoji: '⏱️',
          title: 'Sesiones cortas de 10 países',
          desc: 'Solo necesitas 3 a 5 minutos al día para ver resultados sorprendentes.',
        },
      ],
    },
    {
      badge: 'Paso 3 de 3',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-inner">
          <Sparkles className="w-9 h-9" />
        </div>
      ),
      title: 'Tu memoria siempre al día',
      subtitle: 'La aplicación recuerda qué países te cuestan más para recordártelos en el momento exacto.',
      features: [
        {
          emoji: '🧠',
          title: 'Repaso inteligente automático',
          desc: 'No tienes que preocuparte por qué estudiar: GeoMundo selecciona los países pendientes por ti.',
        },
        {
          emoji: '🔥',
          title: 'Racha diaria',
          desc: 'Practica un ratito cada día para mantener tu racha activa y sumar países dominados.',
        },
        {
          emoji: '⚙️',
          title: 'Modo simple o avanzado',
          desc: 'Cuando quieras más retos, mapas mudos o contrarreloj, puedes activar el «Modo avanzado» en Ajustes.',
        },
      ],
    },
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      if (onStartPractice) {
        onStartPractice();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        {/* Top bar with step indicator & Skip button */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {step.badge}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 px-2 py-1 rounded transition-colors"
          >
            <span>Saltar guía</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content of the step */}
        <div className="py-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            {step.icon}
            <h2
              id="onboarding-title"
              className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-4 leading-tight"
            >
              {step.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2 max-w-md">
              {step.subtitle}
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-200/80 dark:border-stone-800">
            {step.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 text-left">
                <span className="text-xl shrink-0 select-none mt-0.5">{feat.emoji}</span>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {feat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-col gap-4">
          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStep(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-8 bg-emerald-600 dark:bg-emerald-400'
                    : 'w-2.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-medium text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-base shadow-md transition-all ml-auto"
            >
              <span>{currentStep === steps.length - 1 ? '¡Empezar a practicar!' : 'Siguiente'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

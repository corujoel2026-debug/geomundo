import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Info } from 'lucide-react';

const STORAGE_KEY = 'geomundo_cookie_consent';

export type CookieConsentStatus = 'accepted' | 'rejected' | null;

export function getSavedCookieConsent(): CookieConsentStatus {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'accepted' || val === 'rejected') {
      return val;
    }
  } catch (e) {
    console.error('Error reading cookie consent', e);
  }
  return null;
}

export function saveCookieConsent(status: 'accepted' | 'rejected'): void {
  try {
    localStorage.setItem(STORAGE_KEY, status);
  } catch (e) {
    console.error('Error saving cookie consent', e);
  }
}

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacyPolicy,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getSavedCookieConsent();
    if (!consent) {
      // Delay slightly for smooth non-jarring appearance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    saveCookieConsent('accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    saveCookieConsent('rejected');
    setIsVisible(false);
  };

  const handleMoreInfo = () => {
    onOpenPrivacyPolicy();
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de consentimiento de cookies"
      className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-xl z-50 animate-fadeIn"
    >
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h4 className="font-serif text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
              Aviso sobre cookies y publicidad
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Utilizamos cookies propias para guardar tus preferencias en este navegador y cookies de terceros (como redes publicitarias) para mantener GeoMundo gratuito y mostrar anuncios relevantes. Puedes aceptar, rechazar o consultar los detalles en nuestra política de privacidad.
            </p>
          </div>
        </div>

        {/* Action Buttons: Aceptar / Rechazar / Más información */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={handleMoreInfo}
            className="px-3.5 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Más información</span>
          </button>

          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Rechazar</span>
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

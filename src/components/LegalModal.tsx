import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Mail, Copy, Check, ExternalLink } from 'lucide-react';

export type LegalSection = 'privacidad' | 'terminos' | 'contacto';

interface LegalModalProps {
  isOpen: boolean;
  initialSection?: LegalSection;
  onClose: () => void;
  onOpenCookieConsent?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialSection = 'privacidad',
  onClose,
  onOpenCookieConsent,
}) => {
  const [activeSection, setActiveSection] = useState<LegalSection>(initialSection);
  const [copied, setCopied] = useState(false);

  // Sync initialSection whenever the modal opens
  React.useEffect(() => {
    if (isOpen && initialSection) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const contactEmail = 'TU_CORREO@ejemplo.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Información legal y soporte
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 bg-white dark:bg-stone-900 gap-2 sm:gap-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('privacidad')}
            className={`flex items-center gap-2 py-3.5 border-b-2 text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              activeSection === 'privacidad'
                ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Política de privacidad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('terminos')}
            className={`flex items-center gap-2 py-3.5 border-b-2 text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              activeSection === 'terminos'
                ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Términos de uso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('contacto')}
            className={`flex items-center gap-2 py-3.5 border-b-2 text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              activeSection === 'contacto'
                ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contacto</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          {/* POLÍTICA DE PRIVACIDAD */}
          {activeSection === 'privacidad' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-2">
                  Política de Privacidad de GeoMundo
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  Última actualización: Noviembre 2026
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
                <strong>Resumen claro:</strong> Tu progreso de estudio se guarda únicamente en tu navegador (localStorage). No enviamos tus datos personales ni calificaciones a ningún servidor central.
              </div>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  1. Almacenamiento local de datos (localStorage)
                </h4>
                <p>
                  GeoMundo almacena tu información de aprendizaje (países dominados, tarjetas marcadas para repasar, historial de puntuación, rachas diarias, preferencias visuales de modo claro/oscuro y filtros de regiones) <strong>exclusivamente de forma local en tu propio navegador web</strong> mediante la tecnología estándar de <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-xs">localStorage</code>.
                </p>
                <p>
                  No requerimos registro de cuenta ni contraseña. No enviamos tu progreso a servidores externos ni vinculamos tu aprendizaje con tu identidad personal. Puedes borrar estos datos en cualquier momento desde los Ajustes de la aplicación.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  2. Publicidad y servicios de terceros
                </h4>
                <p>
                  Para mantener GeoMundo como un recurso educativo gratuito y accesible para todo el mundo, la aplicación utiliza o integrará servicios de publicidad proporcionados por terceros (tales como Google AdSense u otras redes publicitarias asociadas).
                </p>
                <p>
                  Estos proveedores de servicios pueden recibir datos técnicos de conexión (como tu dirección IP anonimizada, tipo de navegador y resolución de pantalla) para servir anuncios pertinentes y medir su rendimiento.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  3. Uso de cookies para personalización de anuncios
                </h4>
                <p>
                  Los proveedores externos, incluido Google, pueden utilizar <em>cookies</em>, balizas web y tecnologías de almacenamiento local para publicar anuncios basados en las visitas previas del usuario a este sitio web o a otros sitios de Internet.
                </p>
                <p>
                  El uso de cookies publicitarias permite a estos terceros y a sus socios mostrar anuncios basados en los hábitos de navegación del usuario.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  4. Cómo desactivar la personalización de anuncios
                </h4>
                <p>
                  Tienes pleno control sobre el uso de cookies y la personalización de anuncios:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>En esta aplicación:</strong> Puedes utilizar el aviso de cookies de la app para elegir «Rechazar» el uso de cookies no esenciales.{' '}
                    {onOpenCookieConsent && (
                      <button
                        type="button"
                        onClick={onOpenCookieConsent}
                        className="text-stone-900 dark:text-stone-100 underline hover:opacity-80 font-medium"
                      >
                        Abrir configuración de cookies
                      </button>
                    )}
                  </li>
                  <li>
                    <strong>Configuración de anuncios de Google:</strong> Puedes inhabilitar la publicidad personalizada de Google en cualquier momento visitando:{' '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                    >
                      <span>adssettings.google.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li>
                    <strong>Portales de la industria publicitaria:</strong> Puedes darte de baja de la publicidad basada en intereses a través de{' '}
                    <a
                      href="https://optout.aboutads.info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                    >
                      <span>aboutads.info (Digital Advertising Alliance)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>{' '}
                    o{' '}
                    <a
                      href="https://www.youronlinechoices.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                    >
                      <span>youronlinechoices.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>.
                  </li>
                  <li>
                    <strong>En tu navegador:</strong> Puedes configurar tu navegador para bloquear o eliminar cookies en el menú de Privacidad y Seguridad.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  5. Contacto sobre privacidad
                </h4>
                <p>
                  Si tienes cualquier duda acerca del tratamiento de datos o de esta política de privacidad, puedes escribir a:{' '}
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                    {contactEmail}
                  </span>
                </p>
              </section>
            </div>
          )}

          {/* TÉRMINOS DE USO */}
          {activeSection === 'terminos' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-2">
                  Términos de Uso de GeoMundo
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  Condiciones de uso de la plataforma pedagógica
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  1. Objeto y finalidad educativa
                </h4>
                <p>
                  GeoMundo es una herramienta digital de acceso libre y gratuito diseñada con fines pedagógicos, de estudio y de entrenamiento mental en el ámbito de la geografía política y física mundial. Los modos de práctica, tarjetas mnemotécnicas, mapas mudos y cuestionarios están destinados al autoaprendizaje.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  2. Uso personal y gratuito
                </h4>
                <p>
                  Se concede a los usuarios el derecho no exclusivo, gratuito e intransferible de utilizar la aplicación para fines personales, educativos, escolares o de investigación. Queda prohibida la reproducción masiva, extracción automatizada abusiva o redistribución comercial no autorizada.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  3. Fuentes cartográficas y datos de países
                </h4>
                <p>
                  Los datos geográficos, coordenadas, polígonos cartográficos y capitales están basados en fuentes de datos abiertas y de dominio público como Natural Earth, D3.js y normas internacionales ISO 3166. Si detectas cualquier errata, actualización en una capital o modificación de nombre oficial, te invitamos a comunicarlo a través de la sección de contacto.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                  4. Disponibilidad y exclusión de garantías
                </h4>
                <p>
                  GeoMundo se ofrece «tal cual» (as-is) y según disponibilidad. Aunque procuramos una experiencia continua y sin errores, no garantizamos que el servicio sea ininterrumpido. No nos responsabilizamos por la pérdida accidental del progreso almacenado localmente si el usuario borra la caché del navegador o restablece su dispositivo.
                </p>
              </section>
            </div>
          )}

          {/* CONTACTO */}
          {activeSection === 'contacto' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-2">
                  Contacto y Soporte
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">
                  ¿Tienes dudas, sugerencias para añadir nuevos modos pedagógicos o quieres reportar un error? Estamos a tu disposición.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                  Correo electrónico oficial
                </span>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl font-mono text-sm sm:text-base text-stone-900 dark:text-stone-100 select-all">
                    {contactEmail}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium text-xs sm:text-sm hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar correo'}</span>
                  </button>

                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-medium text-xs sm:text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Escribir correo</span>
                  </a>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed pt-2">
                  Responderemos a tus mensajes en el menor tiempo posible. Agradecemos enormemente tus comentarios para continuar mejorando GeoMundo.
                </p>
              </div>

              <div className="border-t border-stone-100 dark:border-stone-800 pt-4 text-xs text-stone-500 space-y-2">
                <h5 className="font-semibold text-stone-700 dark:text-stone-300">Asuntos frecuentes:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Corrección de nombres de capitales, banderas o límites geográficos.</li>
                  <li>Consultas sobre cookies, publicidad y privacidad.</li>
                  <li>Sugerencias para maestros, escuelas y estudiantes.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

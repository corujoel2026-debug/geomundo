import React from 'react';

export interface EspacioPublicitarioProps {
  id?: string;
  className?: string;
  position?: 'inicio' | 'resumen-sesion';
}

/**
 * Componente reutilizable "EspacioPublicitario".
 * Diseñado para alojar futuros bloques publicitarios (Google AdSense, etc.).
 * Por ahora no muestra nada visible en pantalla, preservando una interfaz limpia y libre de distracciones.
 */
export const EspacioPublicitario: React.FC<EspacioPublicitarioProps> = ({
  id = 'slot-publicidad',
  className = '',
  position = 'inicio',
}) => {
  // Por ahora no muestra nada (espacio reservado sin impacto visual)
  return (
    <div
      id={id}
      data-ad-slot="geomundo-ad"
      data-ad-position={position}
      data-ad-status="pending"
      className={`espacio-publicitario hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};

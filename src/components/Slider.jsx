import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';

const Slider = ({ children, onDelete, onCheck, disabled }) => {
  const [{ x }, api] = useSpring(() => ({
    x: 0,
  }));

  // Configuración de gestos con useDrag
  const bind = useDrag(({ active, movement: [x] }) => {
    if (disabled) return;
    if (!active) {
      if (x < -40) {
        onDelete && onDelete();
      } else if (x > 40) {
        onCheck && onCheck();
      }
      api.start({ x: 0 });
    } else {
      api.start({ x: Math.max(-150, Math.min(150, x)) });
    }
    },
    { filterTaps: true }
);

  // Determina el color de fondo según la dirección del deslizamiento
  const bgColor = x.to(val => (val < 0 ? '#f5576c' : val > 0 ? '#96fbc4' : 'transparent'));

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Fondo de color detrás del contenido */}
      <animated.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: bgColor,
          zIndex: 0,
        }}
      />

      {/* Contenido deslizante */}
      <animated.div
        {...bind()}
        style={{
          x,
          touchAction: 'none',
          position: 'relative',
          zIndex: 1,
          background: 'white',
          borderRadius: '5px',
        }}
      >
        {children}
      </animated.div>

      {/* Ícono de Check */}
      <animated.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          fontSize: '24px',
          color: 'white',
          opacity: x.to(val => (val > 40 ? 1 : 0)), // Mostrar solo cuando el deslizamiento es suficiente
          zIndex: 2,
        }}
      >
        ✔️
      </animated.div>

      {/* Ícono de Eliminar */}
      <animated.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          fontSize: '24px',
          color: 'white',
          opacity: x.to(val => (val < -40 ? 1 : 0)), // Mostrar solo cuando el deslizamiento es suficiente
          zIndex: 2,
        }}
      >
        ❌
      </animated.div>
    </div>
  );
};

export default Slider;

import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const Slider = ({ children, onDelete, onCheck, disabled }) => {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(
    ({ active, movement: [mx], cancel }) => {
      if (disabled) return;

      if (!active) {
        if (mx < -60) {
          onDelete && onDelete();
        } else if (mx > 60) {
          onCheck && onCheck();
        }
        api.start({ x: 0 });
      } else {
        api.start({ x: Math.max(-150, Math.min(150, mx)), immediate: true });
      }
    },
    { filterTaps: true, axis: 'x', threshold: 10 } // Solo permitir el movimiento horizontal
  );

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
          background: x.to(val => (val < 0 ? '#f5576c' : val > 0 ? '#08921a8f' : 'transparent')),
          zIndex: 0,
        }}
      />

      {/* Contenido deslizante */}
      <animated.div
        {...bind()}
        style={{
          x,
          position: 'relative',
          zIndex: 1,
          background: 'white',
          borderRadius: '5px',
          touchAction: 'pan-y',
        }}
      >
        {children}
      </animated.div>

      {/* Íconos de Check y Delete */}
      <animated.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          fontSize: '24px',
          color: 'white',
          opacity: x.to(val => (val > 40 ? 1 : 0)),
          zIndex: 0,
        }}
      >
        <span className="material-symbols-outlined icon-xlarge">check</span>
      </animated.div>

      <animated.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          fontSize: '24px',
          color: 'black',
          opacity: x.to(val => (val < -40 ? 1 : 0)),
          zIndex: 0,
        }}
      >
        <span className="material-symbols-outlined icon-large">delete</span>
      </animated.div>
    </div>
  );
};

export default Slider;

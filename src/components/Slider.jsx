import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const Slider = ({ children, onDelete, onCheck, onDrag, disabled }) => {
  const [dragMode, setDragMode] = useState(false);
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [dx, dy], cancel }) => {
      if (disabled) return;

      if (!active) {
        if (dragMode) {
          // Lógica para drag and drop vertical
          onDrag && onDrag(my);
        } else {
          // Lógica para slider horizontal
          if (mx < -60) {
            onDelete && onDelete();
          } else if (mx > 60) {
            onCheck && onCheck();
          }
          api.start({ x: 0, y: 0 });
        }
        setDragMode(false);
      } else {
        if (Math.abs(my) > Math.abs(mx)) {
          // Si el movimiento vertical es mayor, activar dragMode
          setDragMode(true);
          api.start({ y: my, immediate: true });
        } else {
          // Si el movimiento horizontal es mayor, mantener slider
          api.start({ x: Math.max(-150, Math.min(150, mx)), immediate: true });
        }
      }
    },
    { filterTaps: true, axis: dragMode ? 'y' : 'x', threshold: 10 }
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
          background: x.to(val => (val < 0 ? '#ff0000' : val > 0 ? '#08921b' : 'transparent')),
          zIndex: 0,
        }}
      />

      {/* Contenido deslizante o draggable */}
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          touchAction: 'none',
          position: 'relative',
          zIndex: 1,
          background: 'white',
          borderRadius: '5px',
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
          zIndex: 2,
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
          zIndex: 2,
        }}
      >
        <span className="material-symbols-outlined icon-large">delete</span>
      </animated.div>
    </div>
  );
};

export default Slider;

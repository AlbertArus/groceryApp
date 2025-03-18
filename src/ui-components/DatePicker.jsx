import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const DayPickerInput = ({selectedDate, setSelectedDate}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Referencias para detectar clics fuera del calendario
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  
  // Manejador para cerrar el calendario al hacer clic fuera
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isCalendarOpen &&
        calendarRef.current && 
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarOpen]);
    
  // Formatear la fecha al formato requerido (solo número de día y mes en palabras)
  const formattedDate = format(selectedDate, "d 'de' MMMM yyyy", { locale: es });
  
  // Capitalizar correctamente la primera letra del mes (corrigiendo el problema de "Aabril")
  const formattedDateCapitalized = formattedDate.replace(/de ([a-zñ]+)/i, (match, monthName) => {
    return `de ${monthName.charAt(0).toUpperCase()}${monthName.slice(1).toLowerCase()}`;
  });
  
  // Función para formatear el día del mes (solo número)
  const formatDay = (date) => {
    return format(date, "d", { locale: es });
  };
  
  // Función para formatear el mes en el calendario (capitalizado correctamente)
  const formatCaption = (date, options) => {
    // Obtener el mes en texto
    let month = format(date, 'LLLL', { locale: es });
    // Capitalizar correctamente
    month = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    // Obtener el año
    const year = format(date, 'yyyy');
    
    return `${month} ${year}`;
  };
  
  return (
    <div className="calendar-container">
      <div 
        ref={inputRef}
        className="calendar-input fila-between"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        <span>{formattedDateCapitalized}</span>
        <div className="calendar-icon-wrapper">
          <Calendar size={20} color={"#6b7280"} />
        </div>
      </div>
      
      {isCalendarOpen && (
        <div 
          ref={calendarRef}
          className="calendar-dropdown"
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(day) => {
              setSelectedDate(day || new Date());
              setIsCalendarOpen(false);
            }}
            locale={es}
            formatters={{ 
              formatDay,
              formatCaption
            }}
            modifiers={{
              today: new Date(),
            }}
            modifiersStyles={{
              selected: {
                color: "#3b82f6"
              },
              today: {
                border: "1px solid #6b7280"
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DayPickerInput;
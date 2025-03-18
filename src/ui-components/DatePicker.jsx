import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { Calendar } from 'lucide-react';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import {formattedDateCapitalized, formatDay, formatCaption} from "../functions/FormatDate"

const DayPickerInput = ({selectedDate, setSelectedDate}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  
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
  
  return (
    <div className="calendar-container">
      <div 
        ref={inputRef}
        className="calendar-input fila-between"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        <span>{formattedDateCapitalized(selectedDate)}</span>
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
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Función para formatear la fecha completa en "18 de Marzo 2025"
export const formattedDateCapitalized = (date) => {
  if (!date) return "No hay fecha";
  const formattedDate = format(date, "d 'de' MMMM yyyy", { locale: es });

  return formattedDate.replace(/de ([a-zñ]+)/i, (match, monthName) => {
    return `de ${monthName.charAt(0).toUpperCase()}${monthName.slice(1).toLowerCase()}`;
  });
};

// Función para formatear solo el día (número)
export const formatDay = (date) => {
  return date ? format(date, "d", { locale: es }) : "";
};

// Función para formatear el mes y año en el calendario
export const formatCaption = (date) => {
  if (!date) return "";
  let month = format(date, "LLLL", { locale: es });
  month = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  const year = format(date, "yyyy");

  return `${month} ${year}`;
};

// Función para formatear la fecha como "lunes 17, marzo 2025"
export const formatDateWithWeekday = (date) => {
    if (!date) return "No hay fecha";
    
    const formattedDate = format(date, "EEEE d, MMMM yyyy", { locale: es });
    
    // Capitaliza el día de la semana y el mes
    return formattedDate.replace(/^([a-zñ]+)|, ([a-zñ]+)/gi, (match, weekday, month) => {
      if (weekday) {
        return weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();
      } else if (month) {
        return `, ${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()}`;
      }
      return match;
    });
  };
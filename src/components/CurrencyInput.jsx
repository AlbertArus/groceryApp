import { useState } from "react";
import PropTypes from "prop-types";
import { FormatCurrency } from "./FormatCurrency";

const CurrencyInput = ({ value, onChange, editable, locale = "es-ES", currency = "EUR" }) => {
  // Aseguramos que 'value' es un número antes de usarlo
  const numericValue = typeof value === "number" && !Number.isNaN(value) ? value : parseFloat(value) || "";

  const [inputValue, setInputValue] = useState(editable ? numericValue.toString() : FormatCurrency(numericValue, locale, currency));

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.,-]/g, ""); // Remueve caracteres no numéricos
    setInputValue(rawValue);

    // Convertir el valor a número, reemplazando la coma por punto (si es necesario)
    const parsedValue = parseFloat(rawValue.replace(",", "."));
    if (!isNaN(parsedValue)) {
      onChange(parsedValue); // Devuelve el valor numérico al controlador padre
    } else {
      onChange(0); // Si no es válido, devuelve 0
    }
  };

  const handleBlur = () => {
    const parsedValue = parseFloat(inputValue.replace(",", "."));
    if (!isNaN(parsedValue)) {
      setInputValue(FormatCurrency(parsedValue, locale, currency)); // Formatea al salir del campo
    } else {
      setInputValue(""); // Limpia el campo si no es válido
    }
  };

  console.log(value)
  
  // Renderiza el input editable o el texto estático formateado
  return editable ? (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder={FormatCurrency(0, locale, currency)}
    />
  ) : (
    <span>{FormatCurrency(numericValue, locale, currency)}</span>
  );
};

CurrencyInput.propTypes = {
  value: PropTypes.number.isRequired, // Siempre esperamos un número para las operaciones
  onChange: PropTypes.func,
  editable: PropTypes.bool,
  locale: PropTypes.string,
  currency: PropTypes.string,
};

export default CurrencyInput;

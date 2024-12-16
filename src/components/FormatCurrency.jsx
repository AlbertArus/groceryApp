export const FormatCurrency = (amount, locale = "es-ES", currency = "EUR") => {
    if (typeof amount !== "number" || isNaN(amount)) {
        return ""
    }
    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
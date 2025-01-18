import React from 'react';

export const CurrencySelector = ({ onCurrencyChange, defaultCurrency = 'EUR' }) => {
  const currencies = {
    EUR: { locale: 'es-ES', symbol: '€' },
    USD: { locale: 'en-US', symbol: '$' },
    GBP: { locale: 'en-GB', symbol: '£' },
    JPY: { locale: 'ja-JP', symbol: '¥' }
  };

  return (
    <select
      value={defaultCurrency}
      onChange={(e) => onCurrencyChange(e.target.value)}
      className="p-2 border rounded-md"
    >
      {Object.keys(currencies).map(currency => (
        <option key={currency} value={currency}>
          {currency} ({currencies[currency].symbol})
        </option>
      ))}
    </select>
  );
};
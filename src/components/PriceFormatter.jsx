import React from 'react';

export const PriceFormatter = ({ amount, currency = 'EUR', className = '' , style}) => {
  const formatPrice = (value, currencyCode) => {
    const options = {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
    };

    try {
      const locale = {
        'EUR': 'es-ES',
        'USD': 'en-US',
        'GBP': 'en-GB',
        'JPY': 'ja-JP'
      }[currencyCode] || 'es-ES';

      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      // Fallback simple
      const symbols = { EUR: '€', USD: '$', GBP: '£', JPY: '¥' };
      const formattedNumber = Number(value).toFixed(currencyCode === 'JPY' ? 0 : 2);
      return `${symbols[currencyCode]}${formattedNumber}`;
    }
  };

  return (
    <span style={style}>
        {formatPrice(amount, currency)}
    </span>
  )
};
export const countryToCurrency = {
  IN: { code: 'INR', symbol: '₹', rate: 83.5, flag: '🇮🇳', decimals: 2 },
  US: { code: 'USD', symbol: '$', rate: 1, flag: '🇺🇸', decimals: 2 },
  GB: { code: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧', decimals: 2 },
  CA: { code: 'CAD', symbol: 'CA$', rate: 1.36, flag: '🇨🇦', decimals: 2 },
  AU: { code: 'AUD', symbol: 'A$', rate: 1.53, flag: '🇦🇺', decimals: 2 },
  AE: { code: 'AED', symbol: 'AED ', rate: 3.67, flag: '🇦🇪', decimals: 2 },
  EU: { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', decimals: 2 },
  SG: { code: 'SGD', symbol: 'S$', rate: 1.34, flag: '🇸🇬', decimals: 2 }
}

export const defaultCurrency = countryToCurrency.US

export function getUniqueCurrencies() {
  const map = new Map()

  Object.values(countryToCurrency).forEach((currency) => {
    if (!map.has(currency.code)) {
      map.set(currency.code, currency)
    }
  })

  return Array.from(map.values())
}

export function formatPrice(priceUSD, currency = defaultCurrency) {
  const converted = Number(priceUSD || 0) * currency.rate
  return `${currency.flag} ${currency.symbol}${converted.toFixed(currency.decimals)} ${currency.code}`
}
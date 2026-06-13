'use client'

import { createContext, useEffect, useMemo, useState } from 'react'
import { countryToCurrency, defaultCurrency, getUniqueCurrencies } from '@/lib/currency'

export const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(defaultCurrency)
  const currencies = getUniqueCurrencies()

  useEffect(() => {
    const saved = window.localStorage.getItem('purepulse_currency')
    if (saved) {
      const found = currencies.find((item) => item.code === saved)
      if (found) {
        setCurrency(found)
        return
      }
    }

    async function detectCurrency() {
      try {
        const response = await fetch('/api/currency')
        const data = await response.json()
        const detected = countryToCurrency[data.countryCode] || defaultCurrency
        setCurrency(detected)
      } catch {
        setCurrency(defaultCurrency)
      }
    }

    detectCurrency()
  }, [])

  function setCurrencyByCode(code) {
    const found = currencies.find((item) => item.code === code) || defaultCurrency
    setCurrency(found)
    window.localStorage.setItem('purepulse_currency', found.code)
  }

  function formatPrice(priceUSD) {
    const converted = Number(priceUSD || 0) * currency.rate
    return `${currency.flag} ${currency.symbol}${converted.toFixed(currency.decimals)} ${currency.code}`
  }

  const value = useMemo(
    () => ({
      currency,
      currencies,
      setCurrencyByCode,
      formatPrice
    }),
    [currency]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
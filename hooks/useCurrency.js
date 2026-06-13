'use client'

import { useContext } from 'react'
import { CurrencyContext } from '@/context/CurrencyContext'
import { defaultCurrency } from '@/lib/currency'

export function useCurrency() {
  const context = useContext(CurrencyContext)

  if (!context) {
    return {
      currency: defaultCurrency,
      currencies: [defaultCurrency],
      setCurrencyByCode: () => {},
      formatPrice: (priceUSD) => `$${Number(priceUSD || 0).toFixed(2)} USD`
    }
  }

  return context
}
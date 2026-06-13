'use client'

import { useCurrency } from '@/hooks/useCurrency'

export default function CurrencySwitcher() {
  const { currency, currencies, setCurrencyByCode } = useCurrency()

  return (
    <select
      value={currency.code}
      onChange={(event) => setCurrencyByCode(event.target.value)}
      className="rounded-full border border-green-900/10 bg-white px-4 py-3 text-sm font-bold text-green-950 outline-none"
      aria-label="Select currency"
    >
      {currencies.map((item) => (
        <option key={`${item.code}-${item.flag}`} value={item.code}>
          {item.flag} {item.code}
        </option>
      ))}
    </select>
  )
}
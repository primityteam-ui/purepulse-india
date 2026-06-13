'use client'

import { useContext } from 'react'
import { CartContext } from '@/context/CartContext'

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getCartTotal: () => 0,
      getCartCount: () => 0
    }
  }

  return context
}
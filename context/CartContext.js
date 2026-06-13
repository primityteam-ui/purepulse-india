'use client'

import { createContext, useEffect, useMemo, useState } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('purepulse_cart')
      if (saved) setCartItems(JSON.parse(saved))
    } catch {
      setCartItems([])
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('purepulse_cart', JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  function addToCart(item) {
    setCartItems((current) => {
      const existing = current.find(
        (cartItem) => cartItem.productId === item.productId && cartItem.variant === item.variant
      )

      if (existing) {
        return current.map((cartItem) =>
          cartItem.productId === item.productId && cartItem.variant === item.variant
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      }

      return [...current, item]
    })
  }

  function removeFromCart(productId, variant) {
    setCartItems((current) =>
      current.filter((item) => !(item.productId === productId && item.variant === variant))
    )
  }

  function updateQuantity(productId, variant, quantity) {
    const nextQuantity = Math.max(1, Number(quantity) || 1)

    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity: nextQuantity }
          : item
      )
    )
  }

  function clearCart() {
    setCartItems([])
  }

  function getCartTotal() {
    return cartItems.reduce((total, item) => total + item.priceUSD * item.quantity, 0)
  }

  function getCartCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }),
    [cartItems]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
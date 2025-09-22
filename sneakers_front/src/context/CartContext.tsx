import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  size?: string | null;
};

const CART_STORAGE_KEY = 'floa-cart';

export type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, options?: { quantity?: number }) => void;
  updateQuantity: (id: number, size: string | null, quantity: number) => void;
  removeItem: (id: number, size: string | null) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalQuantity: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: React.ReactNode;
};

const readStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as CartItem[];
    if (Array.isArray(parsed)) {
      return parsed
        .filter(item => typeof item?.id === 'number' && typeof item?.name === 'string')
        .map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price ?? 0),
          image: item.image ?? null,
          quantity: Math.max(1, Number(item.quantity ?? 1)),
          size: item.size ?? null,
        }));
    }
  } catch (error) {
    console.warn('Impossible de lire le panier local, réinitialisation.', error);
  }

  return [];
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, options?: { quantity?: number }) => {
    const quantityToAdd = options?.quantity ?? 1;
    const itemSize = item.size ?? null;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        existing => existing.id === item.id && (existing.size ?? null) === itemSize
      );

      if (existingIndex >= 0) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantityToAdd,
        };
        return updated;
      }

      return [...prevItems, { ...item, quantity: quantityToAdd }];
    });

    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: number, size: string | null, quantity: number) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => !(item.id === id && (item.size ?? null) === size));
      }

      return prevItems.map(item => {
        if (item.id === id && (item.size ?? null) === size) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  }, []);

  const removeItem = useCallback((id: number, size: string | null) => {
    setItems(prevItems => prevItems.filter(item => !(item.id === id && (item.size ?? null) === size)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.quantity += item.quantity;
        acc.price += item.price * item.quantity;
        return acc;
      },
      { quantity: 0, price: 0 }
    );
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      totalQuantity: totals.quantity,
      totalPrice: totals.price,
    }),
    [addItem, clearCart, closeCart, isCartOpen, items, openCart, removeItem, totals.price, totals.quantity, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

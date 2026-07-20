import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addCartItem, updateCartOptions, updateCartQuantity } from '../lib/cart';
import type { CartItem, ProductOptionValues } from '../types';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setOptions: (productId: string, options: ProductOptionValues) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  notice: string;
};

const STORAGE_KEY = 'mariosa-cart-v1';
const CartContext = createContext<CartContextValue | null>(null);

function loadItems(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadItems);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const addItem = useCallback((productId: string) => {
    setItems((current) => addCartItem(current, productId));
    setNotice('Украшение добавлено в заявку');
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      setQuantity: (productId, quantity) =>
        setItems((current) => updateCartQuantity(current, productId, quantity)),
      setOptions: (productId, options) =>
        setItems((current) => updateCartOptions(current, productId, options)),
      removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
      clear: () => {
        setItems([]);
        setNotice('');
      },
      notice,
    }),
    [addItem, items, notice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

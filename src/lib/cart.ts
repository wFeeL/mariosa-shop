import type { CartItem, ProductOptionValues } from '../types';

export function addCartItem(items: CartItem[], productId: string): CartItem[] {
  const existing = items.find((item) => item.productId === productId);
  if (existing) {
    return items.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }
  return [...items, { productId, quantity: 1, options: {} }];
}

export function updateCartQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return items.filter((item) => item.productId !== productId);
  return items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
}

export function updateCartOptions(
  items: CartItem[],
  productId: string,
  options: ProductOptionValues,
): CartItem[] {
  return items.map((item) => (item.productId === productId ? { ...item, options } : item));
}


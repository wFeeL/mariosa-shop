import { describe, expect, it } from 'vitest';
import { addCartItem, updateCartQuantity } from './cart';

describe('cart helpers', () => {
  it('adds a product and increments the same product', () => {
    const first = addCartItem([], 'clover-studs');
    expect(first).toEqual([{ productId: 'clover-studs', quantity: 1, options: {} }]);
    expect(addCartItem(first, 'clover-studs')[0].quantity).toBe(2);
  });

  it('removes a product when quantity reaches zero', () => {
    const items = [{ productId: 'clover-studs', quantity: 1, options: {} }];
    expect(updateCartQuantity(items, 'clover-studs', 0)).toEqual([]);
  });
});


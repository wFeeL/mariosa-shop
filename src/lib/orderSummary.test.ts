import { describe, expect, it } from 'vitest';
import { buildOrderSummary, getKnownTotal, hasRequestPrice } from './orderSummary';

describe('order summary', () => {
  const customer = { name: 'Анна', contact: '@anna', note: '' };

  it('calculates only known prices', () => {
    const items = [
      { productId: 'clover-studs', quantity: 2, options: {} },
      { productId: 'summer-spider', quantity: 1, options: {} },
    ];
    expect(getKnownTotal(items)).toBe(5800);
    expect(hasRequestPrice(items)).toBe(true);
  });

  it('keeps custom options and does not pretend an unknown price exists', () => {
    const summary = buildOrderSummary(
      [{ productId: 'summer-spider', quantity: 1, options: { shade: 'сиреневый' } }],
      customer,
    );
    expect(summary).toContain('цена по запросу');
    expect(summary).toContain('Желаемый оттенок: сиреневый');
    expect(summary).toContain('Подскажите, пожалуйста, по наличию, срокам, оплате и доставке.');
  });
});

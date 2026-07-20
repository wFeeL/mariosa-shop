import { orderFieldLabels, productById } from '../data/products';
import type { CartItem, CustomerDetails } from '../types';
import { formatPrice } from './format';

export function getKnownTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = productById.get(item.productId)?.price;
    return total + (price ?? 0) * item.quantity;
  }, 0);
}

export function hasRequestPrice(items: CartItem[]): boolean {
  return items.some((item) => productById.get(item.productId)?.price === null);
}

export function buildOrderSummary(items: CartItem[], customer: CustomerDetails): string {
  const lines = ['Здравствуйте, Марина! Хочу оставить заявку на украшения Mariosa:'];

  items.forEach((item, index) => {
    const product = productById.get(item.productId);
    if (!product) return;
    const linePrice = product.price === null ? 'цена по запросу' : formatPrice(product.price * item.quantity);
    lines.push('', `${index + 1}. ${product.name} × ${item.quantity}: ${linePrice}`);
    Object.entries(item.options).forEach(([key, value]) => {
      if (!value.trim()) return;
      const label = orderFieldLabels[key as keyof typeof orderFieldLabels];
      lines.push(`   ${label}: ${value.trim()}`);
    });
  });

  const total = getKnownTotal(items);
  lines.push('', `Сумма по известным ценам: ${formatPrice(total)}`);
  if (hasRequestPrice(items)) lines.push('В заявке есть изделие с ценой по запросу.');
  if (customer.name.trim()) lines.push(`Имя: ${customer.name.trim()}`);
  if (customer.contact.trim()) lines.push(`Контакт: ${customer.contact.trim()}`);
  if (customer.note.trim()) lines.push(`Общий комментарий: ${customer.note.trim()}`);
  lines.push('', 'Подскажите, пожалуйста, по наличию, срокам, оплате и доставке.');

  return lines.join('\n');
}

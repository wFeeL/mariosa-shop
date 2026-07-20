export function formatPrice(price: number | null): string {
  if (price === null) return 'Цена по запросу';
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export function pluralizeProducts(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return `${count} изделий`;
  if (mod10 === 1) return `${count} изделие`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} изделия`;
  return `${count} изделий`;
}


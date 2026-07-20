import { Minus, Plus } from '@phosphor-icons/react';

export function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="quantity-control" aria-label="Количество">
      <button type="button" onClick={() => onChange(quantity - 1)} aria-label="Уменьшить количество">
        <Minus size={15} weight="light" />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" onClick={() => onChange(quantity + 1)} aria-label="Увеличить количество">
        <Plus size={15} weight="light" />
      </button>
    </div>
  );
}

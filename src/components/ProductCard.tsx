import { Plus } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { availabilityLabels } from '../data/products';
import { formatPrice } from '../lib/format';
import type { Product } from '../types';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link className="product-card__image" to={`/product/${product.slug}`} aria-label={product.name}>
        <img
          src={product.image}
          alt={product.name}
          width="960"
          height="1280"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          style={{ objectPosition: product.imagePosition }}
        />
        <span className={`availability availability--${product.availability}`}>
          {availabilityLabels[product.availability]}
        </span>
      </Link>
      <div className="product-card__body">
        <div>
          <p>{product.collection ?? product.category}</p>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </div>
        <div className="product-card__buy">
          <strong>{formatPrice(product.price)}</strong>
          <button type="button" onClick={() => addItem(product.id)} aria-label={`Добавить ${product.name} в заявку`}>
            <Plus size={18} weight="light" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

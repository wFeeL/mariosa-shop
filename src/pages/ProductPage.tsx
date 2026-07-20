import { ArrowLeft, Check, ShoppingBagOpen } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { availabilityLabels, productById, productBySlug } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatPrice } from '../lib/format';
import { NotFoundPage } from './NotFoundPage';

export function ProductPage() {
  const { slug } = useParams();
  const item = slug ? productBySlug.get(slug) : undefined;
  const { addItem, items } = useCart();
  usePageMeta(item?.name ?? 'Украшение', item?.description);
  if (!item) return <NotFoundPage compact />;

  const quantity = items.find((cartItem) => cartItem.productId === item.id)?.quantity ?? 0;
  const related = item.relatedIds.map((id) => productById.get(id)).filter(Boolean).slice(0, 4);

  return (
    <div className="product-page section-shell page-space">
      <Link className="back-link" to="/catalog"><ArrowLeft size={16} weight="light" /> В каталог</Link>
      <div className="product-detail">
        <div className="product-detail__image">
          <img src={item.image} alt={item.name} width="960" height="1280" fetchPriority="high" style={{ objectPosition: item.imagePosition }} />
          <span className={`availability availability--${item.availability}`}>{availabilityLabels[item.availability]}</span>
        </div>
        <div className="product-detail__copy">
          <p className="eyebrow">{item.collection ?? item.category}</p>
          <h1>{item.name}</h1>
          <p className="product-detail__price">{formatPrice(item.price)}</p>
          <p className="product-detail__description">{item.description}</p>

          <div className="material-list">
            {item.materials.map((material) => <span key={material}><Check size={14} weight="light" /> {material}</span>)}
          </div>

          <div className="product-detail__order">
            <button className="button button--dark button--wide" type="button" onClick={() => addItem(item.id)}>
              <span>{quantity ? `Добавить ещё, в заявке ${quantity}` : 'Добавить в заявку'}</span>
              <span className="button__icon"><ShoppingBagOpen size={18} weight="light" /></span>
            </button>
            <p>{item.price === null ? 'Марина уточнит цену и наличие в ответном сообщении.' : 'На сайте нет оплаты. Марина сначала подтвердит наличие и детали.'}</p>
          </div>

          {item.collection && <div className="set-note"><span>Из коллекции</span><strong>{item.collection}</strong><p>Каждое украшение добавляется в заявку отдельно. У него своя цена.</p></div>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section section-space">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">Можно дополнить</p><h2>Украшения из той же линии</h2></div>
            <p>Выберите только то, что хотите заказать. Каждое изделие считается отдельно.</p>
          </div>
          <div className="product-grid product-grid--four">{related.map((product) => product && <ProductCard key={product.id} product={product} />)}</div>
        </section>
      )}
    </div>
  );
}

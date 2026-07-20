import { ArrowRight, Copy, Trash } from '@phosphor-icons/react';
import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuantityControl } from '../components/QuantityControl';
import { useCart } from '../context/CartContext';
import { orderFieldLabels, orderFieldPlaceholders, productById } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';
import { copyText } from '../lib/clipboard';
import { formatPrice } from '../lib/format';
import { buildOrderSummary, getKnownTotal, hasRequestPrice } from '../lib/orderSummary';
import type { CustomerDetails } from '../types';

const emptyCustomer: CustomerDetails = { name: '', contact: '', note: '' };

export function RequestPage() {
  usePageMeta('Ваша заявка', 'Подготовьте заявку на украшения Mariosa и отправьте её Марине в Telegram.');
  const { items, setQuantity, setOptions, removeItem, clear } = useCart();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const total = useMemo(() => getKnownTotal(items), [items]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!items.length) return;
    setSubmitting(true);
    const summary = buildOrderSummary(items, customer);
    window.sessionStorage.setItem('mariosa-last-request', summary);
    const copied = await copyText(summary);
    clear();
    navigate('/request-ready', { state: { summary, copied } });
  };

  if (!items.length) {
    return (
      <div className="request-page section-shell page-space">
        <div className="empty-request">
          <p className="eyebrow">Ваша заявка</p>
          <h1>Здесь пока тихо</h1>
          <p>Добавьте украшения из каталога. Наличие и детали Марина подтвердит в ответном сообщении.</p>
          <Link className="button button--dark" to="/catalog">Перейти в каталог <ArrowRight size={17} weight="light" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="request-page section-shell page-space">
      <header className="page-intro page-intro--request">
        <div><p className="eyebrow">Без оплаты на сайте</p><h1>Ваша заявка</h1></div>
        <p>Проверьте украшения и добавьте пожелания. Сайт соберёт сообщение для Марины.</p>
      </header>

      <form className="request-layout" onSubmit={submit}>
        <div className="request-items">
          {items.map((cartItem, index) => {
            const item = productById.get(cartItem.productId);
            if (!item) return null;
            return (
              <article className="request-item" key={item.id}>
                <div className="request-item__number">0{index + 1}</div>
                <img src={item.image} alt="" width="960" height="1280" loading="lazy" style={{ objectPosition: item.imagePosition }} />
                <div className="request-item__body">
                  <div className="request-item__heading">
                    <div><p>{item.collection ?? item.category}</p><Link to={`/product/${item.slug}`}>{item.name}</Link><strong>{formatPrice(item.price)}</strong></div>
                    <button type="button" onClick={() => removeItem(item.id)} aria-label={`Удалить ${item.name}`}><Trash size={18} weight="light" /></button>
                  </div>
                  <QuantityControl quantity={cartItem.quantity} onChange={(quantity) => setQuantity(item.id, quantity)} />
                  <details className="product-options" open={item.orderFields.length <= 3}>
                    <summary>Параметры для этого украшения</summary>
                    <div className="product-options__grid">
                      {item.orderFields.map((field) => (
                        <label key={field} className={field === 'comment' ? 'field-wide' : ''}>
                          <span>{orderFieldLabels[field]} <em>необязательно</em></span>
                          <input
                            type="text"
                            name={`${item.id}-${field}`}
                            autoComplete="off"
                            value={cartItem.options[field] ?? ''}
                            placeholder={`${orderFieldPlaceholders[field]}…`}
                            onChange={(event) => setOptions(item.id, { ...cartItem.options, [field]: event.target.value })}
                          />
                        </label>
                      ))}
                    </div>
                  </details>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="request-summary">
          <div className="request-summary__inner">
            <p className="eyebrow">Контакт</p>
            <h2>Куда Вам ответить</h2>
            <label><span>Ваше имя</span><input type="text" name="name" autoComplete="name" required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Например, Анна" /></label>
            <label><span>Telegram или телефон</span><input type="text" name="contact" autoComplete="off" spellCheck={false} required value={customer.contact} onChange={(event) => setCustomer({ ...customer, contact: event.target.value })} placeholder="@username или номер телефона" /></label>
            <label><span>Комментарий ко всей заявке <em>необязательно</em></span><textarea name="note" autoComplete="off" value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} placeholder="Например, украшение нужно в подарок" rows={4} /></label>
            <div className="request-total">
              <span>Сумма товаров с известной ценой</span><strong>{formatPrice(total)}</strong>
              {hasRequestPrice(items) && <small>Плюс изделие с ценой по запросу</small>}
            </div>
            <button className="button button--dark button--wide" type="submit" disabled={submitting}>
              <span>{submitting ? 'Готовим текст…' : 'Подготовить текст заявки'}</span>
              <span className="button__icon"><Copy size={18} weight="light" /></span>
            </button>
            <p className="request-summary__note">Кнопка только скопирует текст. Чтобы отправить заявку, откройте чат с Мариной в Telegram.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

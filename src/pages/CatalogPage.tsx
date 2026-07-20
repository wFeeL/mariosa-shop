import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { categories, products } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';
import { pluralizeProducts } from '../lib/format';
import type { Availability } from '../types';

const availabilityFilters: { value: Availability | 'all'; label: string }[] = [
  { value: 'all', label: 'Любой статус' },
  { value: 'in-stock', label: 'В наличии' },
  { value: 'made-to-order', label: 'На заказ' },
  { value: 'inquiry', label: 'Уточнить' },
];

export function CatalogPage() {
  usePageMeta('Каталог', 'Все украшения Mariosa Jewelry: серьги, чокеры, браслеты, кулоны и сотуары.');
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const selectedCategory = params.get('category') ?? 'Все';
  const selectedCollection = params.get('collection');
  const selectedAvailability = (params.get('availability') ?? 'all') as Availability | 'all';

  const filtered = useMemo(() => products.filter((item) => {
    const matchesQuery = `${item.name} ${item.collection ?? ''} ${item.materials.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    const matchesCollection = !selectedCollection || item.collection === selectedCollection;
    const matchesAvailability = selectedAvailability === 'all' || item.availability === selectedAvailability;
    return matchesQuery && matchesCategory && matchesCollection && matchesAvailability;
  }), [query, selectedAvailability, selectedCategory, selectedCollection]);

  const setParam = (key: string, value: string, emptyValue: string) => {
    const next = new URLSearchParams(params);
    if (value === emptyValue) next.delete(key); else next.set(key, value);
    setParams(next);
  };

  const reset = () => {
    setParams({});
  };
  const hasFilters = query || selectedCategory !== 'Все' || selectedCollection || selectedAvailability !== 'all';

  return (
    <div className="catalog-page section-shell page-space">
      <header className="page-intro page-intro--catalog">
        <div><p className="eyebrow">Каталог</p><h1>Что сейчас в коллекции</h1></div>
        <p>У готовых украшений стоит отметка «В наличии». Для моделей на заказ можно выбрать другой оттенок и обсудить детали с Мариной.</p>
      </header>

      <div className="catalog-toolbar">
        <label className="search-field">
          <MagnifyingGlass size={18} weight="light" aria-hidden="true" />
          <span className="sr-only">Поиск по каталогу</span>
          <input type="search" name="catalog-search" autoComplete="off" value={query} onChange={(event) => setParam('q', event.target.value, '')} placeholder="Название, коллекция, материал…" />
          {query && <button type="button" onClick={() => setParam('q', '', '')} aria-label="Очистить поиск"><X size={16} /></button>}
        </label>
        <label className="select-field">
          <span>Статус</span>
          <select name="availability" value={selectedAvailability} onChange={(event) => setParam('availability', event.target.value, 'all')}>
            {availabilityFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
          </select>
        </label>
      </div>

      <div className="filter-row" aria-label="Категории">
        {categories.map((category) => (
          <button key={category} type="button" className={selectedCategory === category ? 'is-active' : ''} onClick={() => setParam('category', category, 'Все')}>
            {category}
          </button>
        ))}
      </div>

      {selectedCollection && (
        <div className="active-collection">
          <span>Коллекция: {selectedCollection}</span>
          <button type="button" onClick={() => setParam('collection', '', '')}><X size={15} /> Сбросить</button>
        </div>
      )}

      <div className="catalog-count"><span>{pluralizeProducts(filtered.length)}</span>{hasFilters && <button type="button" onClick={reset}>Сбросить фильтры</button>}</div>

      {filtered.length ? (
        <div className="product-grid">{filtered.map((item, index) => <ProductCard key={item.id} product={item} priority={index < 4} />)}</div>
      ) : (
        <div className="empty-state">
          <h2>Ничего не нашлось</h2>
          <p>Сбросьте фильтры. Если ищете определённый оттенок или модель, напишите Марине.</p>
          <button className="button button--dark" type="button" onClick={reset}>Показать весь каталог</button>
        </div>
      )}
    </div>
  );
}

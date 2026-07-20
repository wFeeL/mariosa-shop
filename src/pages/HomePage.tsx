import { ArrowDown, ArrowRight, Sparkle } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { ActionLink } from '../components/ActionLink';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { products } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';

export function HomePage() {
  usePageMeta('Украшения ручной работы', 'Украшения Марины Осовской из бисера. Готовые работы и модели на заказ.');
  const featured = products.filter((item) => item.featured).slice(0, 4);

  return (
    <>
      <section className="hero section-shell">
        <div className="hero__copy">
          <p className="eyebrow"><Sparkle size={13} weight="light" /> Украшения из бисера / ручная работа</p>
          <h1>Никто не верит, что это бисер.</h1>
          <p className="hero__lead">
            Я плету серьги, чокеры, браслеты и сотуары вручную. Выбирайте готовое украшение
            или модель, которую я повторю для Вас в другом оттенке.
          </p>
          <div className="hero__actions">
            <ActionLink to="/catalog">Смотреть коллекцию</ActionLink>
            <ActionLink to="/about" variant="text">Познакомиться с Мариной</ActionLink>
          </div>
          <a className="hero__scroll" href="#selection">
            <ArrowDown size={16} weight="light" /> Листайте к украшениям
          </a>
        </div>

        <div className="hero__visual">
          <div className="hero__frame">
            <img src="/images/editorial/hero-clover.jpg" alt="Комплект Клевера Mariosa Jewelry" width="853" height="1280" fetchPriority="high" />
          </div>
          <div className="hero__note">
            <span>01</span>
            <p>Пуссеты и кулон «Клевер» можно заказать вместе или по отдельности.</p>
          </div>
          <div className="hero__stamp" aria-label="Семь лет мастерства">
            <strong>7</strong>
            <span>лет<br />мастерства</span>
          </div>
        </div>
      </section>

      <section className="marquee" aria-label="Особенности Mariosa">
        <div className="marquee__track">
          {[false, true].map((duplicate) => (
            <div className="marquee__group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              <span>Японский бисер</span><i>✦</i>
              <span>Ручная работа</span><i>✦</i>
              <span>В наличии и на заказ</span><i>✦</i>
              <span>Ваш оттенок и посадка</span><i>✦</i>
            </div>
          ))}
        </div>
      </section>

      <section className="selection section-shell section-space" id="selection">
        <Reveal className="section-heading section-heading--split" variant="left">
          <div>
            <p className="eyebrow">Выбор Марины</p>
            <h2>Что можно заказать сейчас</h2>
          </div>
          <div>
            <p>Девочки, здесь есть украшения в наличии и модели, которые я могу повторить для Вас.</p>
            <Link className="text-link" to="/catalog">Все 20 украшений <ArrowRight size={16} weight="light" /></Link>
          </div>
        </Reveal>
        <div className="product-grid product-grid--featured">
          {featured.map((item, index) => (
            <Reveal className="featured-item" delay={index * 90} key={item.id}>
              <ProductCard product={item} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="collections section-space">
        <div className="section-shell">
          <Reveal className="section-heading">
            <p className="eyebrow">По коллекциям</p>
            <h2>Соберите свой комплект</h2>
          </Reveal>
          <Reveal className="collection-grid" variant="scale">
            <Link className="collection-card collection-card--large" to="/catalog?collection=Морская+линия">
              <img src="/images/products/pearl-blue-star-choker.jpg" alt="Украшение из Морской линии" width="960" height="1280" loading="lazy" />
              <div><span>01 / Морская линия</span><h3>Жемчуг и морские звёзды</h3></div>
            </Link>
            <Link className="collection-card" to="/catalog?collection=Сотуары-паутинки">
              <img src="/images/products/summer-spider-necklace.jpg" alt="Летний сотуар-паутинка" width="960" height="1280" loading="lazy" />
              <div><span>02 / Сотуары-паутинки</span><h3>Одна нить, несколько способов носить</h3></div>
            </Link>
            <Link className="collection-card collection-card--ink" to="/catalog?collection=Дьявол+носит+бисер">
              <img src="/images/products/candle-earrings.jpg" alt="Серьги Свечи" width="719" height="1280" loading="lazy" />
              <div><span>03 / Дьявол носит бисер</span><h3>Кулон «Т» и серьги «Свечи»</h3></div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="maker section-shell section-space">
        <Reveal className="maker__image" variant="left">
          <img src="/images/editorial/maker-portrait.jpg" alt="Образ с серьгами Мятежница Mariosa Jewelry" width="853" height="1280" loading="lazy" />
          <span>9,6 тыс. читательниц в Telegram</span>
        </Reveal>
        <Reveal className="maker__copy" variant="right" delay={120}>
          <p className="eyebrow">От автора</p>
          <blockquote>«Ты разная каждый день, каждый час и минуту. И ты имеешь на это полное право, потому что ты женщина».</blockquote>
          <p>
            Я работаю с бисером семь лет. Если готовая модель Вам подходит, но хочется другой оттенок,
            длину или фурнитуру, напишите об этом в заявке.
          </p>
          <ActionLink to="/about" variant="light">История мастерской</ActionLink>
        </Reveal>
      </section>

      <section className="order-story section-space">
        <div className="section-shell">
          <Reveal className="section-heading section-heading--split" variant="left">
            <div><p className="eyebrow">Как заказать</p><h2>Выберите украшение. Остальное обсудим.</h2></div>
            <p>На сайте нет оплаты. Вы собираете заявку, а наличие, срок и доставку уточняете со мной в Telegram.</p>
          </Reveal>
          <Reveal>
            <ol className="order-steps">
              <li><span>01</span><h3>Выберите</h3><p>Добавьте в заявку готовые украшения или модели на заказ.</p></li>
              <li><span>02</span><h3>Уточните</h3><p>Укажите нужный оттенок, длину или размер.</p></li>
              <li><span>03</span><h3>Напишите</h3><p>Сайт соберёт сообщение. Вам останется отправить его мне в Telegram.</p></li>
            </ol>
          </Reveal>
          <div className="order-story__action"><ActionLink to="/catalog">Начать с каталога</ActionLink></div>
        </div>
      </section>
    </>
  );
}

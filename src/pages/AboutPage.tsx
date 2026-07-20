import { ActionLink } from '../components/ActionLink';
import { Reveal } from '../components/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';

export function AboutPage() {
  usePageMeta('О мастерской', 'Марина Осовская плетёт украшения Mariosa Jewelry из бисера уже семь лет.');
  return (
    <div className="about-page">
      <section className="about-hero section-shell page-space">
        <div className="about-hero__copy"><p className="eyebrow">Mariosa Jewelry</p><h1>Меня зовут Марина. Я плету украшения из бисера семь лет.</h1><p>Здесь есть готовые работы и модели, которые я могу повторить для Вас. Другой оттенок, длину или фурнитуру обсудим перед заказом.</p></div>
        <div className="about-hero__image"><img src="/images/editorial/marina-look.jpg" alt="Образ Mariosa Jewelry" width="853" height="1280" fetchPriority="high" /></div>
      </section>

      <section className="about-manifesto section-space">
        <Reveal className="section-shell about-manifesto__inner">
          <span>7 лет</span>
          <blockquote>Плету не по-детски. Никто не верит, что это бисер.</blockquote>
        </Reveal>
      </section>

      <section className="about-values section-shell section-space">
        <Reveal className="section-heading section-heading--split" variant="left"><div><p className="eyebrow">Как я работаю</p><h2>От первого эскиза до отправки</h2></div><p>Я сама собираю каждое украшение и отвечаю на сообщения. Вы всегда знаете, с кем обсуждаете заказ.</p></Reveal>
        <div className="value-grid">
          <Reveal variant="left"><article><span>01</span><h3>Собираю вручную</h3><p>Подбираю бисер, рисунок и фурнитуру. Последнюю застёжку тоже ставлю сама.</p></article></Reveal>
          <Reveal variant="right" delay={90}><article><span>02</span><h3>Подгоняю под Вас</h3><p>Для браслета нужен обхват запястья, для чокера желаемая длина. В заказной модели можно поменять оттенок и фурнитуру.</p></article></Reveal>
          <Reveal variant="left" delay={180}><article><span>03</span><h3>Отвечаю сама</h3><p>Наличие, срок и доставку Вы обсуждаете со мной в Telegram. Я на связи только в профиле @Osovskaya_Marina.</p></article></Reveal>
        </div>
      </section>

      <section className="about-cta section-shell section-space">
        <div><img src="/images/editorial/mariosa-pouch.jpg" alt="Фирменный мешочек Mariosa Jewelry" width="853" height="1280" loading="lazy" /></div>
        <div><p className="eyebrow">Что есть сейчас</p><h2>Посмотрите готовые украшения</h2><p>Если понравилась модель, но нужен другой оттенок или размер, добавьте пожелание к заявке.</p><ActionLink to="/catalog">Перейти к украшениям</ActionLink></div>
      </section>
    </div>
  );
}

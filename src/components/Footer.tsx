import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <Link className="footer-wordmark" to="/" aria-label="Mariosa Jewelry, на главную">
        <span>Mariosa</span>
        <small>Украшения из бисера ручной работы</small>
      </Link>
      <nav aria-label="Навигация в подвале">
        <Link to="/catalog">Каталог</Link>
        <Link to="/about">О мастерской</Link>
        <Link to="/delivery">Как заказать</Link>
        <Link to="/privacy">Приватность</Link>
        <a href="https://t.me/mariosa_jewelry" target="_blank" rel="noreferrer">Telegram-канал</a>
      </nav>
      <div className="footer-meta">
        <p>Чтобы заказать, соберите заявку и отправьте её Марине в Telegram.</p>
        <p>© {new Date().getFullYear()} Mariosa Jewelry</p>
      </div>
    </footer>
  );
}

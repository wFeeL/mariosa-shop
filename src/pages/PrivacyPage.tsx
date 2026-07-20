import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export function PrivacyPage() {
  usePageMeta('Приватность');
  return (
    <div className="privacy-page section-shell page-space">
      <header className="page-intro">
        <div><p className="eyebrow">Приватность</p><h1>Что происходит с Вашими данными</h1></div>
        <p>Коротко о поведении этой версии сайта до того, как Вы перейдёте в Telegram.</p>
      </header>
      <div className="privacy-copy">
        <section><span>01</span><div><h2>Корзина остаётся в браузере</h2><p>Выбранные украшения и параметры сохраняются в локальном хранилище Вашего браузера. Сайт не отправляет их на сервер.</p></div></section>
        <section><span>02</span><div><h2>Заявку отправляете Вы</h2><p>После подготовки сайт копирует текст. Только Вы решаете, открыть ли чат с Мариной и отправить ли это сообщение в Telegram.</p></div></section>
        <section><span>03</span><div><h2>Telegram работает отдельно</h2><p>При переходе по ссылке действуют условия и политика Telegram. Эта версия сайта не получает доступ к Вашему Telegram-профилю.</p></div></section>
      </div>
      <Link className="text-link" to="/catalog">Вернуться в каталог</Link>
    </div>
  );
}

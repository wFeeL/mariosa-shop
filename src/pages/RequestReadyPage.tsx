import { CheckCircle, Copy, TelegramLogo } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { copyText } from '../lib/clipboard';

type RequestState = { summary?: string; copied?: boolean };

export function RequestReadyPage() {
  usePageMeta('Заявка готова');
  const state = useLocation().state as RequestState | null;
  const summary = state?.summary ?? window.sessionStorage.getItem('mariosa-last-request') ?? '';
  const [copied, setCopied] = useState(Boolean(state?.copied));

  const copyAgain = async () => setCopied(await copyText(summary));

  if (!summary) {
    return <div className="ready-page section-shell page-space"><div className="empty-request"><h1>Нет сохранённой заявки</h1><p>Соберите украшения в каталоге, и мы подготовим для Вас сообщение.</p><Link className="button button--dark" to="/catalog">Открыть каталог</Link></div></div>;
  }

  return (
    <div className="ready-page section-shell page-space">
      <div className="ready-card">
        <div className="ready-card__status"><CheckCircle size={30} weight="light" /><span>Текст заявки готов</span></div>
        <h1>{copied ? 'Скопировано. Осталось отправить.' : 'Скопируйте и отправьте Марине.'}</h1>
        <p>Сайт не отправлял заявку автоматически. Откройте чат с Мариной, вставьте текст и нажмите «Отправить» в Telegram.</p>
        <pre className="ready-card__summary" aria-label="Текст заявки">{summary}</pre>
        <div className="ready-card__actions">
          <a className="button button--dark" href="https://t.me/Osovskaya_Marina" target="_blank" rel="noreferrer">
            <span>Открыть чат с Мариной</span><span className="button__icon"><TelegramLogo size={18} weight="light" /></span>
          </a>
          <button className="button button--ghost" type="button" onClick={copyAgain}><Copy size={17} weight="light" /> {copied ? 'Скопировано' : 'Скопировать текст'}</button>
        </div>
        <Link className="text-link" to="/catalog">Вернуться в каталог</Link>
      </div>
    </div>
  );
}

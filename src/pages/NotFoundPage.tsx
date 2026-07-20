import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage({ compact = false }: { compact?: boolean }) {
  usePageMeta('Страница не найдена');
  return (
    <div className={`not-found section-shell ${compact ? 'not-found--compact' : 'page-space'}`}>
      <span>404</span><h1>Такой страницы нет</h1><p>Откройте каталог или вернитесь на главную.</p><Link className="button button--dark" to="/catalog">Открыть каталог</Link>
    </div>
  );
}

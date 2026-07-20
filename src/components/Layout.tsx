import { Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScrollManager } from './ScrollManager';

export function Layout() {
  const { notice } = useCart();
  return (
    <>
      <a className="skip-link" href="#main-content">К содержанию</a>
      <ScrollManager />
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      {notice && (
        <div className="toast is-visible" role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </>
  );
}

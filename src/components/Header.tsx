import { List, ShoppingBagOpen, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navigation = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/about', label: 'О мастерской' },
  { to: '/delivery', label: 'Как заказать' },
];

export function Header() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" onClick={close} aria-label="Mariosa Jewelry, на главную">
        <span>Mariosa</span>
        <small>Jewelry</small>
      </Link>

      <nav className="desktop-nav" aria-label="Основная навигация">
        {navigation.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="cart-link" to="/request" aria-label={`Заявка, товаров: ${itemCount}`}>
          <ShoppingBagOpen size={20} weight="light" aria-hidden="true" />
          <span>Заявка</span>
          <b>{itemCount}</b>
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={23} weight="light" /> : <List size={23} weight="light" />}
        </button>
      </div>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : true}>
        <nav aria-label="Мобильная навигация">
          {navigation.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={pathname === item.to ? 'is-active' : ''}
              onClick={close}
              style={{ transitionDelay: `${80 + index * 55}ms` }}
            >
              <span>0{index + 1}</span>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/request" onClick={close} style={{ transitionDelay: '245ms' }}>
            <span>04</span>
            Заявка, {itemCount}
          </NavLink>
        </nav>
        <a href="https://t.me/Osovskaya_Marina" target="_blank" rel="noreferrer">
          Написать Марине в Telegram
        </a>
      </div>
    </header>
  );
}

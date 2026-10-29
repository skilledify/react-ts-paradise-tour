import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrollProgress, useScrolled } from '../../hooks/useInView';
import { useFavorites } from '../../context/FavoritesContext';
import { useModal } from '../../context/ModalContext';
import styles from './Header.module.scss';

const NAV = [
  { to: '/', label: 'Главная', icon: '🏠', end: true },
  { to: '/tours', label: 'Туры', icon: '🏝️', end: false },
  { to: '/calculator', label: 'Конструктор тура', icon: '🧮', end: false },
  { to: '/gallery', label: 'Галерея', icon: '📸', end: false },
  { to: '/about', label: 'О нас', icon: '🌋', end: false },
  { to: '/contacts', label: 'Контакты', icon: '📍', end: false },
];

function Logo({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button className={`${styles.logo} ${className ?? ''}`} onClick={onClick} aria-label="Paradise Tour — на главную">
      <span className={styles.logoIcon} aria-hidden>🌴</span>
      <span className={styles.logoText}>
        <b className="grad-text">Paradise</b>&nbsp;Tour
      </span>
    </button>
  );
}

/** Список ссылок — общий и для строки на десктопе, и для мобильной шторки */
function NavItems() {
  return (
    <ul className={styles.list}>
      {NAV.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            <span className={styles.linkIcon} aria-hidden>{item.icon}</span>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default function Header() {
  const progress = useScrollProgress();
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const fav = useFavorites();
  const modal = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  /* Меню закрывается при любом переходе по маршруту */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  /* Esc + блокировка прокрутки, пока меню открыто */
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  /* Шторка живёт только до 992px: при расширении окна закрываем её,
     иначе на десктопе останется заблокированная прокрутка */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 992px)');
    const close = () => setMenuOpen(false);
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) close();
    };
    const onResize = () => {
      if (window.innerWidth > 992) close();
    };
    mq.addEventListener('change', onChange);
    window.addEventListener('resize', onResize);
    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* Фокус уходит в шторку и возвращается на бургер (не на первой отрисовке) */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (menuOpen) closeRef.current?.focus();
    else burgerRef.current?.focus();
  }, [menuOpen]);

  const goHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Прогресс-бар прокрутки страницы */}
      <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} aria-hidden />

      <div className={`${styles.inner} container`}>
        <Logo onClick={goHome} />

        {/* Навигация-строка — только на десктопе */}
        <nav className={styles.nav} aria-label="Основная навигация">
          <NavItems />
        </nav>

        <div className={styles.actions}>
          <Link to="/tours?fav=1" className={styles.favBtn} aria-label={`Избранное, туров: ${fav.count}`}>
            <span className="btn-icon" aria-hidden>❤️</span>
            {fav.count > 0 && <b className={styles.favCount}>{fav.count}</b>}
          </Link>

          <button
            className={`btn btn--ghost ${styles.callBtn}`}
            onClick={() => modal.openModal()}
          >
            <span className="btn-icon" aria-hidden>📞</span>
            Заказать звонок
          </button>

          <button
            ref={burgerRef}
            className={`${styles.burger} ${menuOpen ? styles.burgerX : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="site-nav-drawer"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </div>
      </div>

      {/* Шторка и затемнение рендерятся в body: внутри fixed-хедера они
          попадали в его containing block (backdrop-filter создаёт новый),
          из-за чего при скролле схлопывались до высоты шапки. */}
      {createPortal(
        <>
          <div
            className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          <nav
            id="site-nav-drawer"
            className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
            aria-label="Мобильное меню"
          >
            <div className={styles.drawerHead}>
              <Logo onClick={goHome} className={styles.drawerLogo} />
              <button
                ref={closeRef}
                className={styles.close}
                onClick={closeMenu}
                aria-label="Закрыть меню"
              >
                ✕
              </button>
            </div>

            <NavItems />

            <div className={styles.drawerFoot}>
              <Link to="/tours?fav=1" className={styles.drawerFav}>
                <span className="btn-icon" aria-hidden>❤️</span>
                Избранное
                {fav.count > 0 && <b className={styles.drawerFavCount}>{fav.count}</b>}
              </Link>
              <a href="tel:+78005553535" className={styles.drawerPhone}>
                <span className="btn-icon" aria-hidden>📞</span>
                8 800 555-35-35
              </a>
              <button
                className={`btn btn--primary ${styles.drawerCall}`}
                onClick={() => {
                  setMenuOpen(false);
                  modal.openModal();
                }}
              >
                Заказать звонок
              </button>
            </div>
          </nav>
        </>,
        document.body,
      )}
    </header>
  );
}

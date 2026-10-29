import { useEffect, useState } from 'react';
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

export default function Header() {
  const progress = useScrollProgress();
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const fav = useFavorites();
  const modal = useModal();
  const navigate = useNavigate();
  const location = useLocation();

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

        {/* Навигация: горизонтальная строка на десктопе, drawer — на мобильных */}
        <nav
          id="site-nav"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
          aria-label="Основная навигация"
        >
          {/* Шапка панели — только в мобильном drawer */}
          <div className={styles.drawerHead}>
            <Logo onClick={goHome} className={styles.drawerLogo} />
            <button
              className={styles.close}
              onClick={closeMenu}
              aria-label="Закрыть меню"
            >
              ✕
            </button>
          </div>

          <ul className={styles.list}>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.linkActive : ''}`
                  }
                >
                  <span className={styles.linkIcon} aria-hidden>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Подвал панели — телефон, избранное и звонок; только в drawer */}
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

        {/* Затемнение под мобильной панелью */}
        <div
          className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

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
            className={`${styles.burger} ${menuOpen ? styles.burgerX : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}

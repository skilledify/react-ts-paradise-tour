import { Link, NavLink } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import styles from './Footer.module.scss';

const LINKS = [
  { to: '/tours', label: 'Все туры' },
  { to: '/calculator', label: 'Конструктор тура' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/about', label: 'О компании' },
  { to: '/contacts', label: 'Контакты' },
];

const SOCIALS: { icon: string; label: string; href: string }[] = [
  // Самолёт ведёт на поиск авиабилетов
  { icon: '✈️', label: 'Авиабилеты', href: 'https://www.aviasales.ru/' },
  { icon: '📷', label: 'Instagram', href: 'https://instagram.com/paradise_tour' },
  { icon: '📹', label: 'YouTube', href: 'https://youtube.com/@paradise_tour' },
  { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/78005553535' },
];

export default function Footer() {
  const modal = useModal();

  return (
    <footer className={styles.footer}>
      {/* Волна-разделитель */}
      <div className={styles.wave} aria-hidden>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path
            d="M0,50 C240,95 480,5 720,45 C960,85 1200,15 1440,55 L1440,90 L0,90 Z"
            fill="currentColor"
            opacity="0.18"
          />
          <path
            d="M0,65 C260,20 520,90 780,55 C1040,20 1240,80 1440,45 L1440,90 L0,90 Z"
            fill="currentColor"
            opacity="0.35"
          />
        </svg>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandIcon}>🌴</span>
            <b className="grad-text">Paradise</b>&nbsp;Tour
          </Link>
          <p className={styles.about}>
            Туристическая компания из г. Южногорск. С 2012 года соединяем город с любой точкой
            планеты — от мальдивских лагун до камчатских вулканов. ✈️
          </p>
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className={styles.social}
              >
                <span aria-hidden>{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <h4>Навигация</h4>
          <ul>
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={styles.link}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Контакты</h4>
          <ul className={styles.contacts}>
            <li>
              <a href="tel:+78005553535" className={styles.link}>📞 8 800 555-35-35</a>
            </li>
            <li>
              <a href="mailto:hello@paradise-tour.ru" className={styles.link}>
                ✉️ hello@paradise-tour.ru
              </a>
            </li>
            <li>📍 г. Южногорск, пл. Победы, 14</li>
            <li>🕘 Ежедневно: 09:00 – 21:00</li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Рассылка</h4>
          <p className={styles.subText}>
            Горящие туры и промокоды — не чаще раза в неделю.
          </p>
          <form
            className={styles.subForm}
            onSubmit={(e) => {
              e.preventDefault();
              modal.openModal('Подписка на рассылку');
            }}
          >
            <input type="email" placeholder="Ваш e-mail" required />
            <button type="submit" className="btn btn--primary" aria-label="Подписаться">
              ОК
            </button>
          </form>
          <button className={`${styles.couponBtn}`} onClick={() => modal.openModal('Промокод Paradise Club')}>
            🎁 Получить промокод на -5%
          </button>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© 2012–{new Date().getFullYear()} Paradise Tour · г. Южногорск</span>
        <span className={styles.made}>
          Сделано с ❤️ и <b className="ocean-text">Vite + React + TS + SCSS</b>
        </span>
      </div>
    </footer>
  );
}

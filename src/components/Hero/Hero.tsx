import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HERO_VIDEO } from '../../data/tours';
import { useModal } from '../../context/ModalContext';
import { TOUR_TYPES } from '../../data/tours';
import styles from './Hero.module.scss';

export default function Hero() {
  const modal = useModal();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<string>('');

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (type) params.set('type', type);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className={styles.hero}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop&auto=format&q=70"
        preload="metadata"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Градиентные вуали поверх видео */}
      <div className={styles.overlay} />
      <div className={styles.glowGlow} aria-hidden />

      {/* Летящий самолётик */}
      <span className={styles.plane} aria-hidden>✈️</span>

      <div className={`container ${styles.content}`}>
        <span className={`badge glass ${styles.tag}`}>
          🌴 Турагентство №1 в Южногорске по версии Tripadvisor South · 2025
        </span>

        <h1 className={styles.title}>
          Ваш рай начинается{' '}
          <span className="grad-text">с одного клика</span>
        </h1>

        <p className={styles.subtitle}>
          Подбираем путешествия из г. Южногорск с 2012 года:
          {' '}<b>15 240 туристов</b>, <b>48 стран</b> и один принцип — только то,
          где мы сами были бы рады оказаться.
        </p>

        {/* Быстрый поиск */}
        <form className={`glass ${styles.search}`} onSubmit={search}>
          <label className={styles.field}>
            <span>Куда</span>
            <input
              type="text"
              placeholder="Мальдивы, Пхукет, Камчатка…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Тип отдыха</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Любой</option>
              {TOUR_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <button type="submit" className={`btn btn--primary ${styles.searchBtn}`}>
            <span className={`btn-icon ${styles.searchIcon}`} aria-hidden>🔍</span>
            Найти тур
          </button>
        </form>

        <div className={styles.ctas}>
          <Link to="/tours" className="btn btn--ghost">
            <span className="btn-icon" aria-hidden>🏝️</span>
            Смотреть туры
          </Link>
          <button
            className="btn btn--ghost"
            onClick={() => modal.openModal('Подбор тура')}
          >
            <span className="btn-icon" aria-hidden>🎧</span>
            Бесплатная консультация
          </button>
        </div>

        <ul className={styles.miniStats}>
          <li><b>⭐ 4.9</b> рейтинг в Google</li>
          <li><b>💣 12</b> горящих туров сегодня</li>
          <li><b>💳 0%</b> рассрочка до 12 мес.</li>
        </ul>
      </div>

      {/* Волна внизу hero */}
      <div className={styles.wave} aria-hidden>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path
            d="M0,40 C180,70 360,10 720,38 C1080,66 1260,20 1440,42 L1440,70 L0,70 Z"
            fill="#040a1f"
          />
        </svg>
      </div>
    </section>
  );
}

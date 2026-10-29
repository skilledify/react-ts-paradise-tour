import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../../components/Reveal/Reveal';
import { tours } from '../../data/tours';
import { useFavorites } from '../../context/FavoritesContext';
import { useModal } from '../../context/ModalContext';
import styles from './TourDetail.module.scss';

const money = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`;

const TOUR_TYPES_TITLES: Record<string, string> = {
  Пляжный: '🏖️',
  Экскурсионный: '🏛️',
  Приключения: '🥾',
  Круиз: '🛳️',
};

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fav = useFavorites();
  const modal = useModal();

  const tour = tours.find((t) => t.id === id);

  const [mainPhoto, setMainPhoto] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  if (!tour) {
    return (
      <section className={`section ${styles.page}`}>
        <div className="container">
          <div className={styles.notFound}>
            <span aria-hidden>🧭</span>
            <h2>Тур улетел в закат</h2>
            <p>Такого маршрута в каталоге нет.</p>
            <Link to="/tours" className="btn btn--primary">
              Все туры
              <span className="btn-icon" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const idx = tours.findIndex((t) => t.id === tour.id);
  const prev = tours[(idx - 1 + tours.length) % tours.length];
  const next = tours[(idx + 1) % tours.length];

  const childPrice = tour.price * 0.65;
  const total = Math.round(adults * tour.price + children * childPrice);

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        {/* Хлебные крошки */}
        <nav className={styles.crumbs} aria-label="Хлебные крошки">
          <Link to="/">Главная</Link> <span>/</span>
          <Link to="/tours">Туры</Link> <span>/</span>
          <b>{tour.title}</b>
        </nav>

        <div className={styles.layout}>
          <div className={styles.main}>
            {/* Галерея */}
            <Reveal variant="zoom">
              <div className={styles.gallery}>
                <img
                  className={styles.mainPhoto}
                  src={tour.gallery[mainPhoto]}
                  alt={tour.title}
                />
                <div className={styles.thumbs}>
                  {tour.gallery.map((g, i) => (
                    <button
                      key={i}
                      className={`${styles.thumb} ${i === mainPhoto ? styles.thumbOn : ''}`}
                      onClick={() => setMainPhoto(i)}
                      aria-label={`Фото ${i + 1}`}
                    >
                      <img src={g} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className={styles.typeRow}>
                <span className={styles.typeSymbol} aria-hidden>
                  {TOUR_TYPES_TITLES[tour.type]}
                </span>
                <span>{tour.type}-тур · {tour.city}, {tour.country}</span>
                <span className={styles.stars}>
                  {'⭐'.repeat(Math.round(tour.rating))} {tour.rating}
                  <small> ({tour.reviewsCount} отзывов)</small>
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className={styles.h1}>{tour.title}</h1>
              <p className={styles.desc}>{tour.description}</p>
            </Reveal>

            {/* Что включено */}
            <Reveal delay={0.2}>
              <h2 className={styles.h2}>🧳 Что входит в цену</h2>
              <ul className={styles.includes}>
                {tour.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
            </Reveal>

            {/* Программа */}
            <Reveal delay={0.25}>
              <h2 className={styles.h2}>📍 Программа по дням</h2>
              <ol className={styles.timeline}>
                {tour.itinerary.map((it) => (
                  <li key={it.day}>
                    <span className={styles.dayDot}>День {it.day}</span>
                    <div>
                      <h3>{it.title}</h3>
                      <p>{it.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* ---------- Боковая панель ---------- */}
          <aside className={styles.side}>
            <Reveal variant="right">
              <div className={`glass ${styles.booking}`}>
                <div className={styles.priceHead}>
                  {tour.oldPrice && <s>{money(tour.oldPrice)}</s>}
                  <b>{money(tour.price)}</b>
                  <span>за 1 взрослого</span>
                </div>

                <div className={styles.steppers}>
                  <label>
                    <span>Взрослые</span>
                    <div className={styles.stepper}>
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} aria-label="Меньше взрослых">−</button>
                      <b>{adults}</b>
                      <button onClick={() => setAdults(Math.min(9, adults + 1))} aria-label="Больше взрослых">+</button>
                    </div>
                  </label>
                  <label>
                    <span>Дети 2–12</span>
                    <div className={styles.stepper}>
                      <button onClick={() => setChildren(Math.max(0, children - 1))} aria-label="Меньше детей">−</button>
                      <b>{children}</b>
                      <button onClick={() => setChildren(Math.min(6, children + 1))} aria-label="Больше детей">+</button>
                    </div>
                  </label>
                </div>

                <div className={styles.total}>
                  <span>Итого за тур</span>
                  <b>{money(total)}</b>
                  <small>
                    {adults === 1 && children === 0
                      ? 'для одного гостя'
                      : `${adults} взр.${children ? ` + ${children} дет.` : ''} · дети −35%`}
                  </small>
                </div>

                <button
                  className="btn btn--primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => modal.openModal(`Бронирование тура: ${tour.title} · ${money(total)}`)}
                >
                  <span className="btn-icon" aria-hidden>🎫</span>
                  Забронировать
                </button>

                <button
                  className={`${styles.favToggle} ${fav.has(tour.id) ? styles.favOn : ''}`}
                  onClick={() => fav.toggle(tour.id)}
                >
                  <span className="btn-icon" aria-hidden>
                    {fav.has(tour.id) ? '❤️' : '🤍'}
                  </span>
                  {fav.has(tour.id) ? 'В избранном' : 'В избранное'}
                </button>

                <ul className={styles.assure}>
                  <li>🔒 Цена фиксируется при бронировании</li>
                  <li>💳 Рассрочка 0% до 12 мес.</li>
                  <li>↩️ Перенос даты без штрафов</li>
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>

        {/* Prev / Next */}
        <div className={styles.siblings}>
          <button onClick={() => navigate(`/tours/${prev.id}`)} className={styles.sib}>
            <small>← Предыдущий тур</small>
            <b>
              <span className="btn-icon" aria-hidden>🌴</span>
              {prev.title}
            </b>
          </button>
          <button onClick={() => navigate(`/tours/${next.id}`)} className={`${styles.sib} ${styles.sibRight}`}>
            <small>Следующий тур →</small>
            <b>
              {next.title}
              <span className="btn-icon" aria-hidden>⛱️</span>
            </b>
          </button>
        </div>
      </div>
    </section>
  );
}

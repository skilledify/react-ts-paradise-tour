import { Link } from 'react-router-dom';
import type { Tour } from '../../data/tours';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './TourCard.module.scss';

const money = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

export default function TourCard({ tour }: { tour: Tour }) {
  const fav = useFavorites();
  const liked = fav.has(tour.id);
  const discount = tour.oldPrice
    ? Math.round((1 - tour.price / tour.oldPrice) * 100)
    : 0;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img src={tour.image} alt={tour.title} loading="lazy" />
        <div className={styles.shade} />

        <div className={styles.tags}>
          {tour.hot && <span className={`badge ${styles.hot}`}>🔥 Горящий</span>}
          {tour.hit && <span className={`badge ${styles.hit}`}>⭐ Хит продаж</span>}
          {discount > 0 && <span className={`badge ${styles.sale}`}>−{discount}%</span>}
        </div>

        <button
          className={`${styles.heart} ${liked ? styles.heartOn : ''}`}
          onClick={() => fav.toggle(tour.id)}
          aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
          title={liked ? 'Убрать из избранного' : 'В избранное'}
        >
          {liked ? '❤️' : '🤍'}
        </button>

        <div className={styles.country}>
          <span>📍 {tour.country}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.title}>{tour.title}</h3>
          <span className={styles.rating} title={`Рейтинг ${tour.rating} из 5`}>
            {tour.rating % 1 === 0 ? '⭐'.repeat(Math.round(tour.rating)) : '⭐'.repeat(Math.floor(tour.rating)) + '½'}
            <small>({tour.reviewsCount})</small>
          </span>
        </div>

        <ul className={styles.chips}>
          <li>🗓 {tour.days} дней / {tour.days - 1} ночей</li>
          <li>✈️ из Южногорска</li>
          <li>🧭 {tour.type}</li>
        </ul>

        <div className={styles.footer}>
          <div className={styles.price}>
            {tour.oldPrice && <s>{money(tour.oldPrice)}</s>}
            <b>{money(tour.price)}</b>
            <span>на человека</span>
          </div>
          <Link to={`/tours/${tour.id}`} className={styles.more}>
            Подробнее <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

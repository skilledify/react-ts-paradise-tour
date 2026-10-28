import { useEffect, useState } from 'react';
import { reviews } from '../../data/tours';
import { useModal } from '../../context/ModalContext';
import styles from './Reviews.module.scss';

const AVATAR_HUES = [188, 22, 305, 158, 262, 340];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const modal = useModal();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const r = reviews[index];

  return (
    <section className={styles.reviews}>
      <div className="container">
        <span className="kicker ocean-text">🧳 Отзывы</span>
        <h2 className="section-title">
          Хвастаемся <span className="ocean-text">нашими туристами</span>
        </h2>

        <div
          className={styles.stage}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <figure className={styles.card} key={index}>
            <span className={styles.quoteMark} aria-hidden>“</span>

            <div className={styles.who}>
              <span
                className={styles.avatar}
                style={{
                  background: `linear-gradient(135deg, hsl(${AVATAR_HUES[index % AVATAR_HUES.length]} 85% 60%), hsl(${(AVATAR_HUES[index % AVATAR_HUES.length] + 40) % 360} 85% 45%))`,
                }}
                aria-hidden
              >
                {initials(r.name)}
              </span>
              <div>
                <b>{r.name}</b>
                <small>{r.city} · {r.tour}</small>
                <div className={styles.stars} aria-label={`Оценка ${r.rating} из 5`}>
                  {'⭐'.repeat(Math.floor(r.rating))}
                </div>
              </div>
            </div>

            <blockquote className={styles.text}>{r.text}</blockquote>
          </figure>

          <div className={styles.controls}>
            <button
              className={styles.ctrl}
              onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)}
              aria-label="Предыдущий отзыв"
            >
              ‹
            </button>
            <div className={styles.dots}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === index ? styles.dotOn : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Отзыв ${i + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.ctrl}
              onClick={() => setIndex((index + 1) % reviews.length)}
              aria-label="Следующий отзыв"
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.cta}>
          <button className="btn btn--light" onClick={() => modal.openModal('Оставить отзыв')}>
            ✍️ Оставить свой отзыв
          </button>
        </div>
      </div>
    </section>
  );
}

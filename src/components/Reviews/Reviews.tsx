import { useCallback, useEffect, useRef, useState } from 'react';
import { reviews } from '../../data/tours';
import { useModal } from '../../context/ModalContext';
import { useSwipe } from '../../hooks/useSwipe';
import styles from './Reviews.module.scss';

const AVATAR_HUES = [188, 22, 305, 158, 262, 340];

type Review = (typeof reviews)[number];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function ReviewCard({
  review,
  index,
  className = '',
  hidden = false,
}: {
  review: Review;
  index: number;
  className?: string;
  hidden?: boolean;
}) {
  const hue = AVATAR_HUES[index % AVATAR_HUES.length];

  return (
    <figure
      className={`${styles.card} ${className}`.trim()}
      aria-hidden={hidden || undefined}
    >
      <span className={styles.quoteMark} aria-hidden>“</span>

      <div className={styles.who}>
        <span
          className={styles.avatar}
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 85% 60%), hsl(${(hue + 40) % 360} 85% 45%))`,
          }}
          aria-hidden
        >
          {initials(review.name)}
        </span>
        <div>
          <b>{review.name}</b>
          <small>{review.city} · {review.tour}</small>
          <div className={styles.stars} aria-label={`Оценка ${review.rating} из 5`}>
            {'⭐'.repeat(Math.floor(review.rating))}
          </div>
        </div>
      </div>

      <blockquote className={styles.text}>{review.text}</blockquote>
    </figure>
  );
}

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const indexRef = useRef(0);
  const modal = useModal();

  const go = useCallback((step: 1 | -1) => {
    const current = indexRef.current;
    const next = (current + step + reviews.length) % reviews.length;
    if (next === current) return;

    indexRef.current = next;
    setPreviousIndex(current);
    setDirection(step);
    setIndex(next);
    setAnimKey((k) => k + 1);
  }, []);

  const selectIndex = (next: number) => {
    const current = indexRef.current;
    if (next === current) return;

    indexRef.current = next;
    setPreviousIndex(current);
    setDirection(next > current ? 1 : -1);
    setIndex(next);
    setAnimKey((k) => k + 1);
  };

  const swipe = useSwipe({ onSwipe: go });
  const paused = hovered || swipe.dragging;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, go]);

  // Убираем ушедший отзыв после завершения анимации.
  useEffect(() => {
    if (previousIndex === null) return;
    const id = window.setTimeout(() => setPreviousIndex(null), 620);
    return () => window.clearTimeout(id);
  }, [previousIndex, animKey]);

  const incomingClass =
    animKey === 0 ? '' : direction === 1 ? styles.inNext : styles.inPrev;
  const outgoingClass = direction === 1 ? styles.outNext : styles.outPrev;

  return (
    <section className={styles.reviews}>
      <div className="container">
        <span className="kicker ocean-text">🧳 Отзывы</span>
        <h2 className="section-title">
          Хвастаемся <span className="ocean-text">нашими туристами</span>
        </h2>

        <div
          className={`${styles.stage} ${swipe.dragging ? styles.dragging : ''}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...swipe.handlers}
        >
          <div className={styles.viewport}>
            {previousIndex !== null && (
              <ReviewCard
                key={`out-${animKey}`}
                review={reviews[previousIndex]}
                index={previousIndex}
                className={`${styles.cardOut} ${outgoingClass}`}
                hidden
              />
            )}

            <ReviewCard
              key={`in-${animKey}`}
              review={reviews[index]}
              index={index}
              className={`${styles.cardIn} ${incomingClass}`}
            />
          </div>

          <div className={styles.controls}>
            <button
              className={styles.ctrl}
              onClick={() => go(-1)}
              aria-label="Предыдущий отзыв"
            >
              ‹
            </button>
            <div className={styles.dots}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === index ? styles.dotOn : ''}`}
                  onClick={() => selectIndex(i)}
                  aria-label={`Отзыв ${i + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.ctrl}
              onClick={() => go(1)}
              aria-label="Следующий отзыв"
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.cta}>
          <button className="btn btn--light" onClick={() => modal.openModal('Оставить отзыв')}>
            <span className="btn-icon" aria-hidden>✍️</span>
            Оставить свой отзыв
          </button>
        </div>
      </div>
    </section>
  );
}

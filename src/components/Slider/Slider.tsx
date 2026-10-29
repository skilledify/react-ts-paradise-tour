import { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import styles from './Slider.module.scss';

interface SliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Автопрокрутка: интервал в мс (0 — выключена). */
  autoPlayMs?: number;
  ariaLabel?: string;
}

const perViewQuery = {
  '(max-width: 680px)': 1,
  '(max-width: 1040px)': 2,
};

function useResponsivePerView(): number {
  const get = () => {
    if (typeof window === 'undefined') return 3;
    for (const [q, v] of Object.entries(perViewQuery)) {
      if (window.matchMedia(q).matches) return v;
    }
    return 3;
  };

  const [perView, setPerView] = useState(get);

  useEffect(() => {
    const onResize = () => setPerView(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return perView;
}

export default function Slider<T>({
  items,
  renderItem,
  autoPlayMs,
  ariaLabel,
}: SliderProps<T>) {
  const perView = useResponsivePerView();
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const indexRef = useRef(0);

  const n = items.length;

  const go = useCallback(
    (delta: number) => {
      const current = indexRef.current;
      const next = (((current + delta) % n) + n) % n;
      if (next === current) return;

      indexRef.current = next;
      setPreviousIndex(current);
      setDirection(delta > 0 ? 1 : -1);
      setIndex(next);
      setAnimKey((k) => k + 1);
    },
    [n]
  );

  const selectIndex = (next: number) => {
    const current = indexRef.current;
    if (next === current) return;

    indexRef.current = next;
    setPreviousIndex(current);
    setDirection(next > current ? 1 : -1);
    setIndex(next);
    setAnimKey((k) => k + 1);
  };

  const swipe = useSwipe({
    onSwipe: go,
  });

  const paused = hovered || swipe.dragging;

  useEffect(() => {
    if (!autoPlayMs || paused || n <= 1) return;
    const id = setInterval(() => go(1), autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, paused, go, n]);

  // Убираем ушедший слайд после завершения анимации.
  useEffect(() => {
    if (previousIndex === null) return;
    const id = window.setTimeout(() => setPreviousIndex(null), 620);
    return () => window.clearTimeout(id);
  }, [previousIndex, animKey]);

  const cards = Math.min(perView, n);
  const incomingClass =
    animKey === 0 ? '' : direction === 1 ? styles.inNext : styles.inPrev;
  const outgoingClass = direction === 1 ? styles.outNext : styles.outPrev;

  const renderTrack = (start: number) =>
    Array.from({ length: cards }, (_, i) => {
      const itemIndex = (start + i) % n;
      return (
        <div className={styles.card} key={`${itemIndex}-${i}`}>
          {renderItem(items[itemIndex], itemIndex)}
        </div>
      );
    });

  return (
    <div
      className={`${styles.slider} ${swipe.dragging ? styles.dragging : ''}`}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...swipe.handlers}
    >
      <div className={styles.row}>
        <button className={styles.arrow} onClick={() => go(-1)} aria-label="Назад">
          ‹
        </button>

        <div
          className={styles.viewport}
          style={{ '--cards': cards } as React.CSSProperties}
        >
          {previousIndex !== null && (
            <div
              key={`out-${animKey}`}
              className={`${styles.track} ${styles.trackOut} ${outgoingClass}`}
              aria-hidden="true"
            >
              {renderTrack(previousIndex)}
            </div>
          )}

          <div
            key={`in-${animKey}`}
            className={`${styles.track} ${styles.trackIn} ${incomingClass}`}
          >
            {renderTrack(index)}
          </div>
        </div>

        <button
          className={`${styles.arrow} ${styles.right}`}
          onClick={() => go(1)}
          aria-label="Вперёд"
        >
          ›
        </button>
      </div>

      <div className={styles.dots} role="tablist">
        {items.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => selectIndex(i)}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

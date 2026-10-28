import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const touchX = useRef<number | null>(null);

  const n = items.length;
  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (((i + delta) % n) + n) % n);
      setAnimKey((k) => k + 1);
    },
    [n]
  );

  useEffect(() => {
    if (!autoPlayMs || paused || n <= 1) return;
    const id = setInterval(() => go(1), autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, paused, go, n]);

  // Видимый набор: пер-вью карточек с зацикливанием по кругу
  const visible = Array.from({ length: Math.min(perView, n) }, (_, i) => items[(index + i) % n]);

  return (
    <div
      className={styles.slider}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 46) go(dx > 0 ? -1 : 1);
        touchX.current = null;
      }}
    >
      <div className={styles.row}>
        <button className={styles.arrow} onClick={() => go(-1)} aria-label="Назад">
          ‹
        </button>

        <div className={styles.viewport}>
          <div
            key={animKey}
            className={styles.track}
            style={{ '--cards': Math.min(perView, n) } as React.CSSProperties}
          >
            {visible.map((item, i) => (
              <div className={styles.card} key={i} style={{ animationDelay: `${i * 90}ms` }}>
                {renderItem(item, (index + i) % n)}
              </div>
            ))}
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
            onClick={() => {
              setIndex(i);
              setAnimKey((k) => k + 1);
            }}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

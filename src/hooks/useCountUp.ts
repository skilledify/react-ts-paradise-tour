import { useEffect, useRef, useState } from 'react';

interface CountUp {
  /** Текущее анимированное значение. */
  value: number;
  /** Повесьте ref на элемент-счётчик, чтобы анимация стартовала при появлении на экране. */
  ref: React.RefObject<HTMLSpanElement | null>;
}

/**
 * Плавный счётчик: начинает отсчёт, когда элемент появился в зоне видимости.
 */
export function useCountUp(target: number, duration = 1600): CountUp {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
}

import { useInView } from '../../hooks/useInView';
import type { ReactNode } from 'react';

type Variant = 'up' | 'left' | 'right' | 'zoom';

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  /** Задержка в секундах — удобно для каскадных списков. */
  delay?: number;
  className?: string;
  threshold?: number;
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  threshold = 0.15,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);

  const variantClass =
    variant === 'left'
      ? 'reveal--left'
      : variant === 'right'
        ? 'reveal--right'
        : variant === 'zoom'
          ? 'reveal--zoom'
          : '';

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass} ${inView ? 'is-visible' : ''} ${className}`}
      style={{ ['--reveal-delay' as string]: `${delay}s` }}
    >
      {children}
    </div>
  );
}

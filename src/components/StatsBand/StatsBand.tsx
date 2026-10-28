import styles from './StatsBand.module.scss';
import { useCountUp } from '../../hooks/useCountUp';

interface Stat {
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { icon: '🏖️', value: 15240, suffix: '+', label: 'счастливых туристов с 2012 года' },
  { icon: '🗺️', value: 48, suffix: '', label: 'стран на нашей карте' },
  { icon: '🎆', value: 340, suffix: '+', label: 'маршрутов, проверенных лично' },
  { icon: '🏆', value: 13, suffix: '', label: 'наград и премий индустрии' },
];

function StatItem({ icon, value, suffix, label, delay }: Stat & { delay: number }) {
  const { ref, value: shown } = useCountUp(value);

  return (
    <div className={styles.item} style={{ ['--reveal-delay' as string]: `${delay}s` }}>
      <span className={styles.icon} aria-hidden>{icon}</span>
      <b className={styles.value}>
        <span ref={ref}>{shown.toLocaleString('ru-RU')}</span>
        {suffix}
      </b>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default function StatsBand() {
  return (
    <section className={styles.band} aria-label="Paradise Tour в цифрах">
      <div className={`container ${styles.grid}`}>
        {STATS.map((s, i) => (
          <StatItem key={s.label} {...s} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}

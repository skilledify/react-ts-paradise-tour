import { useScrolled } from '../../hooks/useInView';
import styles from './BackToTop.module.scss';

export default function BackToTop() {
  const show = useScrolled(600);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`${styles.btn} ${show ? styles.show : ''}`}
      onClick={toTop}
      aria-label="Наверх"
      title="Наверх ⛰️"
    >
      <span className={styles.plane} aria-hidden>✈️</span>
    </button>
  );
}

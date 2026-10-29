import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <section className={`section ${styles.page}`}>
      <div className={`container ${styles.box}`}>
        <span className={styles.plane} aria-hidden>✈️</span>
        <h1 className={styles.code}>
          4<span className="grad-text">0</span>4
        </h1>
        <h2>Эта страница улетела в отпуск без нас 🌴</h2>
        <p>
          Но у нас есть всё, что нужно: туры, конструктор и галерея с живыми кадрами.
        </p>
        <div className={styles.btns}>
          <Link to="/" className="btn btn--primary">
            <span className="btn-icon" aria-hidden>🏠</span>
            На главную
          </Link>
          <Link to="/tours" className="btn btn--ghost">
            <span className="btn-icon" aria-hidden>🏝️</span>
            Все туры
          </Link>
        </div>
      </div>
    </section>
  );
}

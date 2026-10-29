import { Link } from 'react-router-dom';
import { SECTION_VIDEOS } from '../../data/tours';
import styles from './VideoBanner.module.scss';

export default function VideoBanner() {
  return (
    <section className={styles.banner}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1600&h=800&fit=crop&auto=format&q=70"
      >
        <source src={SECTION_VIDEOS.island} type="video/mp4" />
      </video>

      <div className={styles.veil} />

      <div className={`container ${styles.content}`}>
        <span className={`badge glass ${styles.tag}`}>🎥 За кадром Paradise Tour</span>
        <h2 className={styles.title}>
          Маршруты, которые мы <span className="grad-text">снимали сами</span>
        </h2>
        <p className={styles.text}>
          Никаких стоковых картинок из интернета: каждая точка на нашем сайте —
          место, где кто-то из команды успел загореть, промокнуть или заболеть
          мантами. Мы едем туда и привозим вам живые рекомендации.
        </p>
        <div className={styles.ctas}>
          <Link to="/gallery" className="btn btn--primary">
            <span className="btn-icon" aria-hidden>📸</span>
            Смотреть галерею
          </Link>
          <Link to="/about" className="btn btn--ghost">
            О команде
            <span className="btn-icon" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

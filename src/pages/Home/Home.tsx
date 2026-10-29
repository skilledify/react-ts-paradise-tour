import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import StatsBand from '../../components/StatsBand/StatsBand';
import TourCard from '../../components/TourCard/TourCard';
import Slider from '../../components/Slider/Slider';
import Reviews from '../../components/Reviews/Reviews';
import Faq from '../../components/Faq/Faq';
import VideoBanner from '../../components/VideoBanner/VideoBanner';
import Reveal from '../../components/Reveal/Reveal';
import { tours } from '../../data/tours';
import { useModal } from '../../context/ModalContext';
import styles from './Home.module.scss';

const FEATURES = [
  { icon: '🎯', title: 'Экономия до 40%', text: 'Сравниваем чартеры, отели и акции wholesale-операторов. Цена на сайте = цена в договоре.' },
  { icon: '🤝', title: 'Поддержка 24/7', text: 'Telegram-бот с экстренной кнопкой + живой менеджер. Даже в 3 ночи на чартере home++.' },
  { icon: '🏝️', title: 'Только проверенное', text: 'Каждый отель и экскурсия — глазами нашей команды. Никаких «коттеджей у моря» из каталога 2010-го.' },
  { icon: '💳', title: 'Рассрочка 0%', text: 'До 12 месяцев без процентов и скрытых комиссий. Первый платёж можно после вылета.' },
];

const DIRECTIONS = [
  { icon: '🏖️', label: 'Пляжный', count: tours.filter((t) => t.type === 'Пляжный').length, grad: 'linear-gradient(135deg,#ff9a00,#ff3d7f)' },
  { icon: '🏛️', label: 'Экскурсионный', count: tours.filter((t) => t.type === 'Экскурсионный').length, grad: 'linear-gradient(135deg,#7b2ff7,#00b4d8)' },
  { icon: '🥾', label: 'Приключения', count: tours.filter((t) => t.type === 'Приключения').length, grad: 'linear-gradient(135deg,#06d6a0,#00b4d8)' },
  { icon: '🛳️', label: 'Круиз', count: tours.filter((t) => t.type === 'Круиз').length, grad: 'linear-gradient(135deg,#00b4d8,#003f8f)' },
];

const CTA_SLOGANS = ['Мальдивы ждут!',
  'Камчатка зовёт!', 'Сочи рядом!'];

export default function Home() {
  const modal = useModal();

  const popular = [...tours].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);

  return (
    <>
      <Hero />
      <StatsBand />

      {/* Направления */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker ocean-text">🧭 Куда угодим</span>
            <h2 className="section-title">
              Четыре стиля <span className="ocean-text">побега из офиса</span>
            </h2>
          </Reveal>

          <div className={styles.dirGrid}>
            {DIRECTIONS.map((d, i) => (
              <Reveal key={d.label} variant="zoom" delay={i * 0.08}>
                <Link
                  to={`/tours?type=${encodeURIComponent(d.label)}`}
                  className={styles.dirCard}
                  style={{ ['--dir-grad' as string]: d.grad }}
                >
                  <span className={styles.dirIcon} aria-hidden>{d.icon}</span>
                  <b>{d.label}</b>
                  <small>{d.count} маршрутов →</small>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные туры */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">🔥 Подборка недели</span>
            <h2 className="section-title">
              Топ туров <span className="grad-text">из Южногорска</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className={styles.sliderWrap}>
              <Slider
                items={popular}
                autoPlayMs={4200}
                ariaLabel="Популярные туры"
                renderItem={(t) => <TourCard tour={t} />}
              />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className={styles.center}>
              <Link to="/tours" className="btn btn--ghost">
                Показать все {tours.length} туров
                <span className="btn-icon" aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Фичи */}
      <section className="section section--light">
        <div className="container">
          <Reveal>
            <span className="kicker" style={{ color: 'var(--c-ink)' }}>💎 Почему Paradise Tour</span>
            <h2 className="section-title" style={{ color: 'var(--c-ink)' }}>
              С нами летают <span className="grad-text">и возвращаются</span>
            </h2>
          </Reveal>

          <div className={styles.featGrid}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1} variant="up">
                <div className={styles.featCard}>
                  <span className={styles.featIcon} aria-hidden>{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VideoBanner />
      <Reviews />
      <Faq />

      {/* Финальный CTA */}
      <section className="section">
        <div className="container">
          <Reveal variant="zoom">
            <div className={styles.finalCta}>
              <span className={styles.ctaPlane} aria-hidden>✈️</span>
              <h2 className={styles.ctaTitle}>
                Готовы собрать свой <span className="ocean-text">рай</span>?
              </h2>
              <p className={styles.ctaText}>
                {CTA_SLOGANS[new Date().getDate() % CTA_SLOGANS.length]}
                {' '}Оставьте заявку — за 15 минут соберём 3 варианта под ваш бюджет.
              </p>
              <div className={styles.ctaButtons}>
                <button className="btn btn--primary" onClick={() => modal.openModal('Экспресс-подбор тура')}>
                  <span className="btn-icon" aria-hidden>🎧</span>
                  Получить консультацию
                </button>
                <Link to="/calculator" className="btn btn--ghost">
                  <span className="btn-icon" aria-hidden>🧮</span>
                  Собрать тур самому
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

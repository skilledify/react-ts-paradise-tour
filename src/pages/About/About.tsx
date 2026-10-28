import Reveal from '../../components/Reveal/Reveal';
import { SECTION_VIDEOS } from '../../data/tours';
import styles from './About.module.scss';

const TIMELINE = [
  { year: '2012', icon: '🚪', title: 'Первая командировка', text: 'Девиз «продаём только то, где были сами». 93 тура за первый год, один офис на пл. Победы и карта на всю стену.' },
  { year: '2015', icon: '✈️', title: 'Первый чартер из Южногорска', text: 'Организовали прямые рейсы в Анталью: за сезон — 286 счастливых туристов и ноль пересадок.' },
  { year: '2018', icon: '🏝️', title: 'Разворот на приключения', text: 'Камчатка, Исландия, Исландские фьорды и Килиманджаро. 40% клиентов возвращаются второй год за новыми впечатлениями.' },
  { year: '2021', icon: '💻', title: 'Онлайн-конструктор туров', text: 'Сайт переехал в браузер: подбор, расчёт и рассрочка 0% — за пять минут без визита в офис.' },
  { year: '2024', icon: '🏆', title: 'Медаль «Лучшее агентство региона»', text: '15 240 туристов, 48 стран и наш главный секрет — мы по-прежнему ездим в такие же туры, как клиенты.' },
];

const TEAM = [
  { name: 'Марина Санина', role: 'Директор · Азия и Океания', hue: 188, years: 'с 2012' },
  { name: 'Гоша Крылов', role: 'Специалист по Турции и Египту', hue: 26, years: 'с 2015' },
  { name: 'Лена Югова', role: 'Горные маршруты', hue: 158, years: 'с 2017' },
  { name: 'Илья Осипов', role: 'Европа и круизы', hue: 305, years: 'с 2019' },
];

const VALUES = [
  { icon: '🧭', title: 'Компас вместо каталога', text: 'Мы не пихаем всё подряд: каждую заявку разбираем как маршрут — что важно, какой бюджет, какая мечта.' },
  { icon: '👂', title: 'Слушаем себя и вас', text: 'Ежегодный аудит туров: 41 направление сняли с продаж, потому что сами разочаровались.' },
  { icon: '🛡️', title: 'Цена = договор', text: 'Никаких доплат «по прилёту». Всё, что входит в тур, прописано до копейки и зафиксировано.' },
];

export default function About() {
  return (
    <>
      {/* Мини-hero с видео */}
      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=700&fit=crop&auto=format&q=70"
        >
          <source src={SECTION_VIDEOS.road} type="video/mp4" />
        </video>
        <div className={styles.heroVeil} />

        <div className={`container ${styles.heroContent}`}>
          <Reveal>
            <span className="kicker">🌋 Яркие подробности</span>
            <h1 className={styles.h1}>
              Мы — <span className="grad-text">Paradise Tour</span>.<br />
              13 лет влюбляем туристов в отпуск.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Цифры сверху */}
      <section className="section">
        <div className="container">
          <div className={styles.badgeStats}>
            <Reveal variant="zoom"><div><b>13 лет</b><span>работы с 2012</span></div></Reveal>
            <Reveal variant="zoom" delay={0.06}><div><b>15 240</b><span>выездов оформлено</span></div></Reveal>
            <Reveal variant="zoom" delay={0.12}><div><b>48 стран</b><span>на карте</span></div></Reveal>
            <Reveal variant="zoom" delay={0.18}><div><b>96%</b><span>продаж — по рекомендации друзей и соседей</span></div></Reveal>
          </div>
        </div>
      </section>

      {/* Ценности */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Три правила, <span className="ocean-text">которые не нарушаем</span></h2>
          </Reveal>
          <div className={styles.values}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}>{v.icon}</span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Таймлайн */}
      <section className={`section ${styles.timelineSec}`}>
        <div className="container">
          <Reveal>
            <span className="kicker ocean-text">🕰 Наш путь</span>
            <h2 className="section-title">13 лет длиною в <span className="ocean-text">три кругосветки</span></h2>
          </Reveal>

          <div className={styles.timeline}>
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} variant={i % 2 === 0 ? 'left' : 'right'} delay={0.05}>
                <div className={`${styles.tlItem} ${i % 2 === 0 ? styles.tlLeft : styles.tlRight}`}>
                  <span className={styles.tlYear}><b>{t.year}</b><i>{t.icon}</i></span>
                  <div className={styles.tlCard}>
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="section-title">Те, кто отвечает <span className="grad-text">за ваш отпуск</span></h2>
          </Reveal>

          <div className={styles.team}>
            {TEAM.map((p, i) => (
              <Reveal key={p.name} variant="zoom" delay={i * 0.08}>
                <div className={styles.teamCard}>
                  <span
                    className={styles.teamAvatar}
                    style={{
                      background: `linear-gradient(135deg, hsl(${p.hue} 80% 62%), hsl(${(p.hue + 45) % 360} 80% 46%))`,
                    }}
                    aria-hidden
                  >
                    {p.name.split(/\s+/).map((w) => w[0]).join('')}
                  </span>
                  <b>{p.name}</b>
                  <small>{p.role}</small>
                  <span className={styles.teamYears}>🌞 {p.years}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

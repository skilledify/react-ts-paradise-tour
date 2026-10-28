import { useState } from 'react';
import Reveal from '../../components/Reveal/Reveal';
import { SECTION_VIDEOS } from '../../data/tours';
import styles from './Contacts.module.scss';

const CHANNELS = [
  { icon: '📞', title: 'Единый номер', text: '8 800 555-35-35', sub: 'звонок по России бесплатный' },
  { icon: '✉️', title: 'Почта', text: 'hello@paradise-tour.ru', sub: 'ответ в течение 2 часов, мск' },
  { icon: '📍', title: 'Офис', text: 'г. Южногорск, пл. Победы, 14', sub: 'вход со двора, 2-й этаж' },
  { icon: '🕘', title: 'Часы работы', text: 'Ежедневно 09:00–21:00', sub: 'онлайн-заявки — круглосуточно' },
];

export default function Contacts() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <Reveal>
          <span className="kicker ocean-text">📍 Давайте знакомиться</span>
          <h1 className="section-title">
            Контакты <span className="grad-text">Paradise Tour</span> в Южногорске
          </h1>
        </Reveal>

        <div className={styles.layout}>
          {/* Форма */}
          <Reveal variant="left" delay={0.08}>
            <div className={`glass ${styles.formCard}`}>
              {sent ? (
                <div className={styles.sent}>
                  <span aria-hidden>🏆</span>
                  <h3>Сообщение прилетело!</h3>
                  <p>Ответим на вашу почту в течение 2 часов. А пока полистайте туры — вдруг что-то зацепит 💫</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={submit}>
                  <h3 className={styles.formTitle}>✍️ Оставьте сообщение</h3>

                  <div className={styles.row}>
                    <label>
                      <span>Имя</span>
                      <input type="text" placeholder="Как вас зовут?" required />
                    </label>
                    <label>
                      <span>Телефон</span>
                      <input type="tel" placeholder="+7 (___) ___-__-__" required pattern="[\d\s+()-]{10,}" />
                    </label>
                  </div>

                  <label>
                    <span>Сообщение</span>
                    <textarea
                      rows={4}
                      placeholder="Куда и когда хотите поехать, что важно…"
                      required
                    />
                  </label>

                  <label className={styles.agree}>
                    <input type="checkbox" required />
                    <span>Согласен(на) на обработку персональных данных</span>
                  </label>

                  <button type="submit" className="btn btn--primary">Отправить 🚀</button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Карта-заглушка */}
          <Reveal variant="right" delay={0.12}>
            <div className={styles.mapCard}>
              <video
                className={styles.mapVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&h=700&fit=crop&auto=format&q=70"
              >
                <source src={SECTION_VIDEOS.waves} type="video/mp4" />
              </video>
              <div className={styles.mapVeil} />

              <div className={styles.pinWrap}>
                <span className={styles.pin} aria-hidden>📍</span>
                <span className={styles.pinCity}>Южногорск</span>
              </div>

              <div className={styles.mapBadge}>
                <b> gps: 54.44° с.ш., 61.63° в.д.</b>
                <small>Стереотипно лучший вид на пл. Победы из офиса 2-го этажа 🪟</small>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Каналы связи */}
        <div className={styles.channels}>
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className={styles.channel}>
                <span className={styles.channelIcon} aria-hidden>{c.icon}</span>
                <div>
                  <small>{c.title}</small>
                  <b>{c.text}</b>
                  <p>{c.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

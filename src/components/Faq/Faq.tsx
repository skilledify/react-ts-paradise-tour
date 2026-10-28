import { useState } from 'react';
import styles from './Faq.module.scss';

const FAQ = [
  {
    q: 'Как забронировать тур?',
    a: 'Выберите тур на сайте или соберите свой в конструкторе, оставьте заявку — менеджер перезвонит в течение 15 минут, подтвердит цены и поможет с документами. Аванс — 25%, остальное за 7 дней до выезда.',
  },
  {
    q: 'Работаете ли вы в рассрочку?',
    a: 'Да! Рассрочка 0% на 6 и 12 месяцев от банков-партнёров. Оформление — за 10 минут онлайн по паспорту, первый платёж — после вылета. 🎉',
  },
  {
    q: 'С каких городов вылетают ваши туры?',
    a: 'Базовый вылет — г. Южногорск. Мы также стыкуем ж/д и авиаподлёт из Челябинска, Екатеринбурга и Магнитогорска — посчитаем и сравним на карте цен.',
  },
  {
    q: 'Что делать, если отпуск сорвался?',
    a: 'Переносим тур один раз без потери средств или возвращаем 95% при отмене за 14+ дней. Точные условия — в договоре, мы всегда сначала предлагаем решения, а не штрафы.',
  },
  {
    q: 'Нужна ли виза для ваших направлений?',
    a: 'Для Турции, Египта, Таиланда, Кубы и Мальдив виза не нужна (или по прилёте). В Дубай оформляем быстро онлайн, в Японию и страны Шенгена помогаем собрать пакет — консьерж-уровень.',
  },
  {
    q: 'А если я поеду один?',
    a: 'Отличные туры без доплаты за одноместное размещение — у нас их пара десятков ежемесячно. А ещё есть клубные поездки: шесть одиноких незнакомцев на Бали уже третий год вместе хардкорят. 😉',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.faq}>
      <div className="container">
        <span className="kicker ocean-text">❓ Вопрос — ответ</span>
        <h2 className="section-title">Держите <span className="ocean-text">главное</span> до звонка</h2>

        <div className={styles.list}>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
                <button
                  className={styles.q}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.icon} aria-hidden>{isOpen ? '🎯' : '❔'}</span>
                  <span className={styles.qText}>{item.q}</span>
                  <span className={styles.chevron} aria-hidden>▾</span>
                </button>
                <div className={styles.aWrap} style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className={styles.aInner}>
                    <p className={styles.a}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

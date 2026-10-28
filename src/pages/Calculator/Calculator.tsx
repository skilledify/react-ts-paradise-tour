import { useMemo, useState } from 'react';
import Reveal from '../../components/Reveal/Reveal';
import { useModal } from '../../context/ModalContext';
import styles from './Calculator.module.scss';

const money = (n: number) =>
  `${new Intl.NumberFormat('ru-RU').format(Math.round(n))} ₽`;

/* ---------- База расчёта ---------- */

interface Destination {
  id: string;
  label: string;
  emoji: string;
  base: number; // базовая цена за человека за день
  note: string;
}

const DESTINATIONS: Destination[] = [
  { id: 'turkey', label: 'Турция', emoji: '🇹🇷', base: 6200, note: 'всё включено' },
  { id: 'egypt', label: 'Египет', emoji: '🇪🇬', base: 5900, note: 'риф и жара' },
  { id: 'thailand', label: 'Таиланд', emoji: '🛕', base: 8400, note: 'экзотика' },
  { id: 'maldives', label: 'Мальдивы', emoji: '🩴', base: 18500, note: 'виллы над водой' },
  { id: 'bali', label: 'Бали', emoji: '🌺', base: 10200, note: 'джунгли и серф' },
  { id: 'uae', label: 'ОАЭ', emoji: '🏙️', base: 11800, note: 'будущее по соседству' },
  { id: 'russia-south', label: 'Сочи', emoji: '⛰️', base: 3900, note: 'без перелёта' },
  { id: 'kamchatka', label: 'Камчатка', emoji: '🌋', base: 13600, note: 'край земли' },
  { id: 'iceland', label: 'Исландия', emoji: '🧊', base: 17300, note: 'северное сияние' },
];

const COMFORT = [
  { id: 'eco', label: 'Эконом 3–4*', mult: 1, icon: '🎒' },
  { id: 'std', label: 'Комфорт 5*, завтраки', mult: 1.35, icon: '😎' },
  { id: 'lux', label: 'Люкс 5*, всё включено', mult: 1.9, icon: '💎' },
];

const EXTRAS = [
  { id: 'insurance', label: 'Расширенная страховка', price: 1200, icon: '🛡️' },
  { id: 'excursions', label: 'Пакет экскурсий', price: 8500, icon: '🗺️' },
  { id: 'vip', label: 'VIP-трансфер и бизнес-лаунж', price: 6400, icon: '🥂' },
  { id: 'spa', label: 'SPA-пакет в отеле', price: 5200, icon: '💆' },
];

const SEASON = [
  { id: 'low', label: 'Низкий (сентябрь–ноябрь)', mult: 0.9 },
  { id: 'mid', label: 'Средний (декабрь–май)', mult: 1 },
  { id: 'high', label: 'Высокий (июнь–август, НГ)', mult: 1.25 },
];

const PROMOS: Record<string, { label: string; off: number }> = {
  PARADISE10: { label: '−10% по промокоду PARADISE10', off: 0.1 },
  YUZHNOGORSK: { label: '−5% землякам 🏙️', off: 0.05 },
  PARADISE5: { label: '−5% по промокоду PARADISE5', off: 0.05 },
};

function Stepper({
  value, min, max, onChange, suffix,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className={styles.stepper}>
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="Меньше">−</button>
      <b>{value} {suffix}</b>
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Больше">+</button>
    </div>
  );
}

export default function Calculator() {
  const modal = useModal();
  const [destId, setDestId] = useState('turkey');
  const [days, setDays] = useState(8);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [comfort, setComfort] = useState('std');
  const [season, setSeason] = useState('mid');
  const [extras, setExtras] = useState<Set<string>>(new Set(['insurance']));
  const [promo, setPromo] = useState('');
  const [animKey, setAnimKey] = useState(0);

  const bounce = () => setAnimKey((k) => k + 1);

  const toggleExtra = (id: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    bounce();
  };

  const calc = useMemo(() => {
    const dest = DESTINATIONS.find((d) => d.id === destId)!;
    const comfortMult = COMFORT.find((c) => c.id === comfort)!.mult;
    const seasonMult = SEASON.find((s) => s.id === season)!.mult;

    const base = dest.base * days * comfortMult * seasonMult * (days >= 14 ? 0.95 : 1); // скидка 5% за 14+
    const perPerson = {
      adults: base,
      children: base * 0.65,
    };
    const stay = adults * perPerson.adults + kids * perPerson.children;
    const extrasSum = [...extras].reduce(
      (s, id) => s + (EXTRAS.find((e) => e.id === id)?.price ?? 0) * (adults + kids),
      0
    );
    const promoObj = promo.trim().toUpperCase() in PROMOS ? PROMOS[promo.trim().toUpperCase()] : null;
    const beforePromo = stay + extrasSum;
    const discount = promoObj ? beforePromo * promoObj.off : 0;
    const total = beforePromo - discount;

    return { dest, comfortMult, seasonMult, stay, extrasSum, discount, total, beforePromo, promoObj };
  }, [destId, days, adults, kids, comfort, season, extras, promo]);

  const monthly = calc.total / 12;

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <Reveal>
          <span className="kicker ocean-text">🧮 Конструктор</span>
          <h1 className="section-title">
            Собери тур <span className="grad-text">под свой бюджет</span>
          </h1>
          <p className={styles.sub}>
            Прозрачный расчёт прямо из Южногорска: двигайте ползунки и смотрите итог.
          </p>
        </Reveal>

        <div className={styles.layout}>
          {/* ---------- Левая колонна: контролы ---------- */}
          <Reveal variant="left" delay={0.08}>
            <div className={`glass ${styles.panel}`}>
              {/* Направление */}
              <fieldset>
                <legend>🌴 Направление</legend>
                <div className={styles.destGrid}>
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.id}
                      className={`${styles.dest} ${destId === d.id ? styles.destOn : ''}`}
                      onClick={() => { setDestId(d.id); bounce(); }}
                    >
                      <span className={styles.destEmoji}>{d.emoji}</span>
                      <b>{d.label}</b>
                      <small>{d.note}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Дни */}
              <fieldset>
                <legend>🗓 Длительность</legend>
                <input
                  type="range"
                  min={3}
                  max={30}
                  value={days}
                  onChange={(e) => { setDays(Number(e.target.value)); bounce(); }}
                />
                <div className={styles.rangeMeta}>
                  <span>3 дня</span>
                  <b>
                    {days} {days === 30 && '− скидка 5% за длительность! 🏅'}
                  </b>
                  <span>30 дней</span>
                </div>
              </fieldset>

              {/* Кто летит */}
              <fieldset>
                <legend>👨‍👩‍👧 Кто летит</legend>
                <div className={styles.peopleGrid}>
                  <label>
                    <span>Взрослые</span>
                    <Stepper value={adults} min={1} max={9} onChange={(v) => { setAdults(v); bounce(); }} />
                  </label>
                  <label>
                    <span>Дети 2–12</span>
                    <Stepper value={kids} min={0} max={6} onChange={(v) => { setKids(v); bounce(); }} />
                  </label>
                </div>
              </fieldset>

              {/* Комфорт */}
              <fieldset>
                <legend>💎 Уровень комфорта</legend>
                <div className={styles.radioRow}>
                  {COMFORT.map((c) => (
                    <label key={c.id} className={styles.radio}>
                      <input
                        type="radio"
                        name="comfort"
                        checked={comfort === c.id}
                        onChange={() => { setComfort(c.id); bounce(); }}
                      />
                      <span>
                        <b>{c.icon} {c.label}</b>
                        <small>×{c.mult}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Сезон */}
              <fieldset>
                <legend>🌤 Сезон</legend>
                <select value={season} onChange={(e) => { setSeason(e.target.value); bounce(); }}>
                  {SEASON.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </fieldset>

              {/* Допы */}
              <fieldset>
                <legend>✨ Дополнительно</legend>
                <div className={styles.extras}>
                  {EXTRAS.map((e) => (
                    <label key={e.id} className={`${styles.extra} ${extras.has(e.id) ? styles.extraOn : ''}`}>
                      <input
                        type="checkbox"
                        checked={extras.has(e.id)}
                        onChange={() => toggleExtra(e.id)}
                      />
                      <span>
                        <b>{e.icon} {e.label}</b>
                        <small>{money(e.price)} за человека</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Промокод */}
              <fieldset>
                <legend>🎫 Промокод</legend>
                <div className={styles.promoRow}>
                  <input
                    type="text"
                    placeholder="PARADISE10"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                  />
                  {calc.promoObj ? (
                    <span className={`badge ${styles.promoOk}`}>{calc.promoObj.label}</span>
                  ) : (
                    <small className={styles.promoHint}>
                      попробуйте <b>PARADISE10</b> (только для вас 😉)
                    </small>
                  )}
                </div>
              </fieldset>
            </div>
          </Reveal>

          {/* ---------- Правая колонна: итог ---------- */}
          <Reveal variant="right" delay={0.14}>
            <div className={styles.total} key={animKey}>
              <span className={styles.totalKicker}>💸 Ваш тур стоит</span>

              <b className={styles.totalValue}>
                {calc.promoObj && <s>{money(calc.beforePromo)}</s>}
                {money(calc.total)}
              </b>

              {calc.discount > 0 && (
                <span className={`badge ${styles.totalDiscount}`}>
                  🎉 Экономия {money(calc.discount)}
                </span>
              )}

              <ul className={styles.breakdown}>
                <li>
                  <span>Проживание и перелёт ({calc.dest.label})</span>
                  <b>{money(calc.stay)}</b>
                </li>
                <li>
                  <span>Допы ({extras.size})</span>
                  <b>{money(calc.extrasSum)}</b>
                </li>
                {calc.discount > 0 && (
                  <li className={styles.discountRow}>
                    <span>Промокод</span>
                    <b>−{money(calc.discount)}</b>
                  </li>
                )}
              </ul>

              <div className={styles.meter} aria-hidden>
                {[...Array(24)].map((_, i) => (
                  <i
                    key={i}
                    style={{
                      opacity: i / 24 < 0.72 ? 1 : 0.35,
                      background:
                        i < 8
                          ? 'var(--grad-sun)'
                          : i < 16
                            ? 'var(--grad-tropical)'
                            : 'var(--grad-ocean)',
                    }}
                  />
                ))}
              </div>

              <div className={styles.monthly}>
                💳 Рассрочка 0% — <b>{money(monthly)}</b> в месяц на 12 мес.
              </div>

              <button
                className="btn btn--primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() =>
                  modal.openModal(
                    `Тур в ${calc.dest.label}: ${days} дней, ${adults + kids} чел. — ${money(calc.total)}`
                  )
                }
              >
                🚀 Забронировать за {money(calc.total)}
              </button>

              <small className={styles.fine}>
                Расчёт предварительный. Финальную цену подтверждаем после проверки
                отелей и чартеров — обычно она <b>ещё ниже</b>. 😉
              </small>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

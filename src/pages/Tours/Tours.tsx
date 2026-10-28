import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourCard from '../../components/TourCard/TourCard';
import Reveal from '../../components/Reveal/Reveal';
import { tours, TOUR_TYPES, COUNTRIES } from '../../data/tours';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './Tours.module.scss';

type SortKey = 'popular' | 'priceAsc' | 'priceDesc' | 'duration';

const money = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`;

export default function Tours() {
  const [params, setParams] = useSearchParams();
  const fav = useFavorites();

  const q = params.get('q') ?? '';
  const type = params.get('type') ?? '';
  const favOnly = params.get('fav') === '1';

  const [country, setCountry] = useState('');
  const [maxPrice, setMaxPrice] = useState(0); // 0 = без ограничения
  const [sort, setSort] = useState<SortKey>('popular');

  const filtered = useMemo(() => {
    let list = tours.filter((t) => {
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${t.title} ${t.country} ${t.city} ${t.type}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (type && t.type !== type) return false;
      if (country && t.country !== country) return false;
      if (favOnly && !fav.has(t.id)) return false;
      if (maxPrice > 0 && t.price > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case 'priceAsc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        list = [...list].sort((a, b) => a.days - b.days);
        break;
      default:
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    }
    return list;
  }, [q, type, country, favOnly, maxPrice, sort, fav]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const reset = () => {
    setCountry('');
    setMaxPrice(0);
    setSort('popular');
    setParams({}, { replace: true });
  };

  const activeFilters = Boolean(q || type || favOnly || country || maxPrice > 0);

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <Reveal>
          <span className="kicker ocean-text">🗺️ Все предложения</span>
          <h1 className="section-title">
            Каталог туров <span className="grad-text">из Южногорска</span>
          </h1>
          <p className={styles.sub}>
            {filtered.length} из {tours.length} туров{' '}
            {favOnly && <span className={`badge ${styles.favBadge}`}>❤️ только избранное</span>}
          </p>
        </Reveal>

        {/* ---------- Фильтры ---------- */}
        <Reveal delay={0.1}>
          <div className={`glass ${styles.filters}`}>
            <input
              className={styles.search}
              type="search"
              placeholder="🔍 Куда, страна или курорт…"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
            />

            <div className={styles.chips}>
              <button
                className={`${styles.chip} ${!type ? styles.chipOn : ''}`}
                onClick={() => setParam('type', '')}
              >
                Все типы
              </button>
              {TOUR_TYPES.map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${type === t ? styles.chipOn : ''}`}
                  onClick={() => setParam('type', type === t ? '' : t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className={styles.controls}>
              <label>
                <span>Страна</span>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="">Любая</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Бюджет: {maxPrice ? `до ${money(maxPrice)}` : 'любой'}</span>
                <input
                  type="range"
                  min={40000}
                  max={220000}
                  step={10000}
                  value={maxPrice || 220000}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setMaxPrice(v >= 220000 ? 0 : v);
                  }}
                />
              </label>

              <label>
                <span>Сортировка</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="popular">По популярности</option>
                  <option value="priceAsc">Цена ↑</option>
                  <option value="priceDesc">Цена ↓</option>
                  <option value="duration">Длительность</option>
                </select>
              </label>

              {activeFilters && (
                <button className={styles.reset} onClick={reset}>
                  ✕ Сбросить
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* ---------- Сетка туров ---------- */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((t, i) => (
              <Reveal key={t.id} variant="up" delay={(i % 3) * 0.08}>
                <TourCard tour={t} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className={styles.empty}>
              <span aria-hidden>🛸</span>
              <h3>Похоже, такого тура у нас нет</h3>
              <p>
                Попробуйте ослабить фильтры или{' '}
                <button
                  className={styles.linkBtn}
                  onClick={() => setParams({ fav: '1' }, { replace: true })}
                >
                  посмотрите избранное
                </button>
                . А лучше — соберите маршрут в конструкторе 🧮
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from 'react';
import Reveal from '../../components/Reveal/Reveal';
import styles from './Gallery.module.scss';

const img = (id: string, w = 900, h = 700) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`;

const THUMB = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=480&fit=crop&auto=format&q=70`;

interface Photo {
  id: string;
  album: 'Пляжи' | 'Горы' | 'Круизы' | 'Виды';
  caption: string;
  tour: string;
}

const ALBUMS = ['Все', 'Пляжи', 'Горы', 'Круизы', 'Виды'] as const;

const PHOTOS: Photo[] = [
  { id: '1507525428034-b723cf961d3e', album: 'Пляжи', caption: 'Утро на пустом пляже', tour: 'Сочи' },
  { id: '1514282401047-d79a71a590e8', album: 'Пляжи', caption: 'Лагуна атолла Ари', tour: 'Мальдивы' },
  { id: '1505142468610-359e7d316be0', album: 'Пляжи', caption: 'Пальма, солнце, собой!', tour: 'Сейшелы' },
  { id: '1544551763-46a013bb70d5', album: 'Пляжи', caption: 'Мир под маской', tour: 'Египет' },
  { id: '1506905925346-21bda4d32df4', album: 'Горы', caption: 'Облака ниже нас', tour: 'Исландия' },
  { id: '1504893524553-b855bce32c67', album: 'Горы', caption: 'Водопад в тумане', tour: 'Исландия' },
  { id: '1455587734955-081b22074882', album: 'Горы', caption: 'Тропа хайкера', tour: 'Камчатка' },
  { id: '1548574505-5e239809ee19', album: 'Круизы', caption: 'Лайнер-город', tour: 'Средиземноморье' },
  { id: '1567899378494-47b22a2ae96a', album: 'Круизы', caption: 'Вечер на палубе', tour: 'Греческие острова' },
  { id: '1502602898657-3e91760cbb34', album: 'Виды', caption: 'Закат над Сеной', tour: 'Париж' },
  { id: '1512453979798-5ea266f8880c', album: 'Виды', caption: 'Огни Дубая', tour: 'ОАЭ' },
  { id: '1537996194471-e657df975ab4', album: 'Виды', caption: 'Храм в джунглях', tour: 'Бали' },
  { id: '1541432901042-2d8bd64b4a9b', album: 'Виды', caption: 'Бухта Антальи', tour: 'Турция' },
  { id: '1548345680-f5475ea5df84', album: 'Горы', caption: 'Лёд и тишина', tour: 'Байкал' },
  { id: '1540959733332-eab4deabeeaf', album: 'Виды', caption: 'Неон Токио', tour: 'Япония' },
  { id: '1573843981267-be1999ff37cd', album: 'Пляжи', caption: 'Гранит и бирюза', tour: 'Сейшелы' },
  { id: '1544161515-4ab6ce6db874', album: 'Пляжи', caption: 'Шезлонги с видом', tour: 'Анталья' },
  { id: '1571896349842-33c89424de2d', album: 'Круизы', caption: 'Бесконечный бассейн', tour: 'Пхукет' },
];

export default function Gallery() {
  const [album, setAlbum] = useState<(typeof ALBUMS)[number]>('Все');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const photos = useMemo(
    () => (album === 'Все' ? PHOTOS : PHOTOS.filter((p) => p.album === album)),
    [album]
  );

  useEffect(() => {
    if (lightbox == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i == null ? null : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft')
        setLightbox((i) => (i == null ? null : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, photos.length]);

  const current = lightbox != null ? photos[lightbox] : null;

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <Reveal>
          <span className="kicker ocean-text">📸 Живые кадры</span>
          <h1 className="section-title">
            Галерея <span className="grad-text">без стоков</span>
          </h1>
          <p className={styles.sub}>
            Всё снято нашими гидами и туристами. Наведите — и камера сама расскажет историю.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className={styles.albums}>
            {ALBUMS.map((a) => (
              <button
                key={a}
                className={`${styles.album} ${album === a ? styles.albumOn : ''}`}
                onClick={() => setAlbum(a)}
              >
                {a}
                {a !== 'Все' && (
                  <small>
                    {PHOTOS.filter((p) => p.album === a).length}
                  </small>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <div className={styles.masonry}>
          {photos.map((p, i) => (
            <Reveal key={p.id + i} variant="zoom" delay={(i % 4) * 0.07} className={styles.cell}>
              <button className={styles.card} onClick={() => setLightbox(i)}>
                <img src={THUMB(p.id)} alt={p.caption} loading="lazy" />
                <span className={styles.info}>
                  <b>{p.caption}</b>
                  <small>{p.tour} · {p.album}</small>
                </span>
                <span className={styles.zoom} aria-hidden>🔍</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---------- Лайтбокс ---------- */}
      <div
        className={`${styles.shadowbox} ${current ? styles.boxOpen : ''}`}
        onClick={() => setLightbox(null)}
        aria-hidden={!current}
      >
        {current && (
          <figure className={styles.shadowInner} onClick={(e) => e.stopPropagation()}>
            <img src={img(current.id, 1400, 950)} alt={current.caption} />
            <figcaption>
              <b>{current.caption}</b>
              <small>🗺 {current.tour} · кадр {(lightbox ?? 0) + 1} из {photos.length}</small>
            </figcaption>

            <button
              className={`${styles.nav} ${styles.navLeft}`}
              onClick={() => setLightbox(((lightbox ?? 0) - 1 + photos.length) % photos.length)}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            <button
              className={`${styles.nav} ${styles.navRight}`}
              onClick={() => setLightbox(((lightbox ?? 0) + 1) % photos.length)}
              aria-label="Следующее фото"
            >
              ›
            </button>
            <button className={styles.close} onClick={() => setLightbox(null)} aria-label="Закрыть">✕</button>
            <small className={styles.hint}>← → листать, Esc — закрыть</small>
          </figure>
        )}
      </div>
    </section>
  );
}

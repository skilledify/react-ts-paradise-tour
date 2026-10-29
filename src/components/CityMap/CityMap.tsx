import styles from './CityMap.module.scss';

/**
 * Схематичная карта Южногорска — вымышленного приморского города
 * на черноморском побережье Краснодарского края (район Большого Сочи).
 * Рисуется целиком в SVG: ни внешних тайлов, ни ключей, ни запросов.
 *
 * Композиция слоями с севера на юг: хребет → город → набережная → пляж → море.
 * Площадь Победы стоит ровно в центре viewBox (450, 350): при
 * preserveAspectRatio="slice" центр карты всегда совпадает с центром
 * карточки, поэтому DOM-маркер «50%/50%» попадает точно на офис.
 */

/* Береговая линия: плавная дуга, море занимает нижнюю полосу */
const COAST_D =
  'M -40 430 C 100 462, 220 492, 340 516 C 460 536, 580 552, 700 560 C 800 560, 880 550, 940 540';

const LAND_D = `${COAST_D} L 940 -40 L -40 -40 Z`;
const SEA_D = `${COAST_D} L 940 720 L -40 720 Z`;

/* Набережная — та же дуга, сдвинутая вглубь суши */
const PROMENADE_D =
  'M -40 404 C 100 436, 220 466, 340 490 C 460 510, 580 526, 700 534 C 800 534, 880 524, 940 514';

/* Хребет на севере — Кавказ за городом, ломаной линией с разной высотой пиков */
const RIDGE =
  'M -20 168 L 30 120 L 62 138 L 104 66 L 138 112 L 172 92 L 206 128 ' +
  'L 244 52 L 282 104 L 318 84 L 352 124 L 392 40 L 430 96 L 466 74 ' +
  'L 500 116 L 540 58 L 576 106 L 612 80 L 648 120 L 688 48 L 724 100 ' +
  'L 758 78 L 794 118 L 832 56 L 866 104 L 900 84 L 920 116 ' +
  'L 920 -20 L -20 -20 Z';

/* Вторая линия хребта — дальние вершины, чуть светлее */
const RIDGE_FAR =
  'M -20 140 L 36 96 L 74 118 L 120 52 L 158 100 L 196 78 L 232 112 ' +
  'L 272 40 L 310 92 L 348 70 L 386 110 L 426 30 L 464 86 L 502 62 ' +
  'L 540 104 L 580 46 L 618 94 L 656 68 L 694 108 L 734 38 L 772 88 ' +
  'L 810 66 L 848 106 L 888 44 L 920 92 L 920 -20 L -20 -20 Z';

const ROAD_X = [20, 150, 285, 615, 750, 880];
const ROAD_Y = [150, 280, 415, 545];

/* Ось берега для отсечения кварталов, ушедших в воду */
const COAST_PTS: Array<[number, number]> = [
  [-40, 430], [100, 462], [220, 492], [340, 516],
  [460, 536], [580, 552], [700, 560], [820, 552], [940, 540],
];

function coastY(x: number): number {
  for (let i = 0; i < COAST_PTS.length - 1; i += 1) {
    const [x0, y0] = COAST_PTS[i];
    const [x1, y1] = COAST_PTS[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return 560;
}

type Block = { x: number; y: number; w: number; h: number };

const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  for (let i = 0; i < ROAD_X.length - 1; i += 1) {
    for (let j = 0; j < ROAD_Y.length - 1; j += 1) {
      const x = ROAD_X[i];
      const y = ROAD_Y[j];
      const w = ROAD_X[i + 1] - x;
      const h = ROAD_Y[j + 1] - y;
      const pad = 13;
      const jitter = ((i * 7 + j * 11) % 3) * 4;
      const bottom = y + h;
      const cx = x + w / 2;
      /* Кварталы уходят под воду и под горы — не рисуем */
      if (bottom > coastY(cx) - 34) continue;
      if (y < 150) continue;
      out.push({
        x: x + pad,
        y: y + pad + jitter,
        w: w - pad * 2 - jitter,
        h: h - pad * 2 - jitter * 0.6,
      });
    }
  }
  return out;
})();

const TREES = [
  [700, 250], [736, 280], [776, 245], [818, 286], [846, 254],
  [708, 328], [762, 340], [822, 346], [672, 298],
];

/* Пальмовая аллея вдоль набережной */
const PALMS: Array<[number, number]> = [
  [90, 428], [168, 452], [246, 476], [330, 500], [430, 522],
];

/* Переулки — тонкая сетка внутри кварталов, чтобы город не выглядел клеткой */
const LANE_X = [88, 218, 372, 522, 682, 812];
const LANE_Y = [215, 348, 480];

const POIS = [
  { x: 372, y: 208, label: 'Ратуша' },
  { x: 210, y: 322, label: 'Рынок' },
  { x: 300, y: 470, label: 'Порт' },
];

/* Волны — короткие штрихи в акватории */
const WAVES = [
  'M 40 600 q 30 -10 60 0',
  'M 130 636 q 26 -9 52 0',
  'M 240 594 q 30 -10 60 0',
  'M 320 650 q 26 -9 52 0',
  'M 430 606 q 30 -10 60 0',
  'M 540 648 q 26 -9 52 0',
  'M 640 600 q 30 -10 60 0',
  'M 740 640 q 26 -9 52 0',
  'M 830 604 q 30 -10 60 0',
];

export default function CityMap({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.map} ${className ?? ''}`}
      viewBox="0 0 900 700"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Схематичная карта Южногорска: офис Paradise Tour на площади Победы, 14, в 25 км от Сочи"
    >
      <defs>
        <pattern id="cm-grid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        </pattern>

        <linearGradient id="cm-avenue" gradientUnits="userSpaceOnUse" x1="-60" y1="0" x2="960" y2="0">
          <stop offset="0" stopColor="#ff9a00" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#ff5a3d" stopOpacity="0.62" />
          <stop offset="1" stopColor="#ff3d7f" stopOpacity="0.5" />
        </linearGradient>

        <radialGradient id="cm-plaza" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9a3d" stopOpacity="0.26" />
          <stop offset="0.6" stopColor="#ff7a00" stopOpacity="0.1" />
          <stop offset="1" stopColor="#ff7a00" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="cm-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#155a86" />
          <stop offset="0.35" stopColor="#0e4066" />
          <stop offset="1" stopColor="#07203a" />
        </linearGradient>

        <linearGradient id="cm-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1a2e" />
          <stop offset="1" stopColor="#122b47" />
        </linearGradient>

        <linearGradient id="cm-ridgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16304d" />
          <stop offset="1" stopColor="#1a3b5c" />
        </linearGradient>

        <clipPath id="cm-land">
          <path d={LAND_D} />
        </clipPath>
      </defs>

      {/* Подложка */}
      <rect width="900" height="700" fill="#081428" />
      <rect width="900" height="700" fill="url(#cm-grid)" />

      {/* Дальние вершины */}
      <path d={RIDGE_FAR} fill="url(#cm-ridgeFar)" opacity="0.55" />
      {/* Основной хребет */}
      <g className={styles.ridge}>
        <path d={RIDGE} fill="url(#cm-ridge)" />
        <path className={styles.ridgeLine} d={RIDGE} fill="none" />
      </g>

      {/* ---------- Город: всё, что на суше, обрезано по берегу ---------- */}
      <g clipPath="url(#cm-land)">
        <g transform="rotate(-3 450 350)">
          {/* Кварталы */}
          <g className={styles.blocks}>
            {BLOCKS.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="6" />
            ))}
          </g>

          {/* Переулки */}
          <g className={styles.lanes}>
            {LANE_X.map((x) => (
              <line key={`lx${x}`} x1={x} y1="120" x2={x} y2="760" />
            ))}
            {LANE_Y.map((y) => (
              <line key={`ly${y}`} x1="-60" y1={y} x2="960" y2={y} />
            ))}
          </g>

          {/* Улицы */}
          <g className={styles.roads}>
            {ROAD_X.map((x) => (
              <line key={`vx${x}`} x1={x} y1="130" x2={x} y2="760" />
            ))}
            {ROAD_Y.map((y) => (
              <line key={`hy${y}`} x1="-60" y1={y} x2="960" y2={y} />
            ))}
          </g>

          {/* Проспект Победы — акцентная магистраль.
              Градиент задан в userSpaceOnUse: у горизонтальной линии
              bounding box нулевой высоты, и objectBoundingBox-градиент
              на ней не отрисовывается вообще. */}
          <line className={styles.avenue} x1="-60" y1={ROAD_Y[1]} x2="960" y2={ROAD_Y[1]} />
        </g>
      </g>

      {/* Набережная */}
      <path className={styles.promenade} d={PROMENADE_D} />

      {/* Пляж */}
      <path className={styles.beach} d={COAST_D} />

      {/* Море */}
      <g className={styles.coast}>
        <path className={styles.sea} d={SEA_D} />
        <path className={styles.surf} d={COAST_D} />
        {WAVES.map((d, i) => (
          <path key={i} className={styles.wave} d={d} />
        ))}
      </g>

      {/* Пальмовая аллея */}
      <g className={styles.palms}>
        {PALMS.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="3.6" />
          </g>
        ))}
      </g>

      {/* Парк */}
      <g className={styles.park}>
        <path d="M 660 190 C 700 155, 790 150, 845 180 C 890 205, 890 270, 850 305 C 805 340, 715 340, 675 305 C 635 270, 630 220, 660 190 Z" />
        {TREES.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 7 : 5} />
        ))}
      </g>

      {/* Площадь Победы */}
      <g className={styles.plaza}>
        <circle cx="450" cy="350" r="140" fill="url(#cm-plaza)" />
        <circle cx="450" cy="350" r="64" />
        <circle className={styles.plazaRing} cx="450" cy="350" r="86" />
      </g>

      {/* Точки интереса */}
      <g className={styles.pois}>
        {POIS.map((p) => (
          <g key={p.label}>
            <circle className={styles.poiDot} cx={p.x} cy={p.y} r="5" />
            <text className={styles.poiLabel} x={p.x + 12} y={p.y + 5}>{p.label}</text>
          </g>
        ))}
      </g>

      {/* Подписи. Держим их внутри x≈170…700: при узкой карточке
          SVG режется по горизонтали, и всё, что правее, обрезается. */}
      <g className={styles.labels}>
        <text x="196" y={ROAD_Y[0] - 9}>ул. Морская</text>
        <text x="196" y={ROAD_Y[1] - 9}>просп. Победы</text>
        <text x="196" y={ROAD_Y[2] - 9}>ул. Гагарина</text>
        <text className={styles.parkLabel} x="664" y="330">Парк Южный</text>
        <text className={styles.plazaLabel} x="450" y="470" textAnchor="middle">пл. Победы</text>
        <text className={styles.seaLabel} x="180" y="536" transform="rotate(-8 180 536)">Чёрное море</text>
        <text className={styles.quayLabel} x="470" y="520" transform="rotate(-3 470 520)">Набережная</text>
      </g>

      {/* Компас */}
      <g className={styles.compass} transform="translate(760 108)">
        <circle r="24" />
        <path d="M0 -14 L5.5 6 L0 2 L-5.5 6 Z" />
        <text y="-30" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

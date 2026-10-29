<div align="center">

# 🌴 Paradise Tour

**Добро пожаловать на сайт туристической компании Paradise Tour из г. Южногорск**:
видео  в hero, живой конструктор тура, галерея с лайтбоксом
и много красочной анимации.

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS Modules + Sass](https://img.shields.io/badge/CSS_Modules-Sass-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![GitHub Actions](https://img.shields.io/badge/Deploy-GitHub_Actions-2088FF?logo=github-actions&logoColor=white)](.github/workflows/deploy.yml)

[Возможности](#-возможности) · [Страницы](#-страницы) · [Скрипты](#-скрипты) · [Деплой](#-публикация-на-github-pages) · [Структура](#-структура-проекта)

</div>

> 🖼 Живое превью: `https://skilledify.github.io/react-ts-paradise-tour/`
> (автоматически после первого мерджа в `main`)

---

## 🚀 Возможности

| | Фича | Как это выглядит |
|---|---|---|
| 🎥 | **Hero-видео на пол экрана** | Тематические волны океана поверх вуали, летящий самолётик, быстрый поиск тура прямо на видео |
| 🧮 | **Конструктор тура** | Направление, дни, туристы, уровень комфорта, сезон, допы. Промокоды `PARADISE10` и `YUZHNOGORSK`, блок рассрочки 0% — всё пересчитывается мгновенно |
| 🗺️ | **Каталог туров** | Поиск по тексту, чипсы типов, страна, ползунок бюджета, 4 сортировки, аккуратное «пустое состояние» |
| ❤️ | **Избранное** | Сердечки на карточках сохраняются в `localStorage`, счётчик — прямо в шапке |
| 🧾 | **Страница тура** | Галерея с превью, программа по дням (таймлайн), «что входит», калькулятор бронирования в sticky-панели цены |
| 🖼️ | **Галерея + лайтбокс** | Фильтры по альбомам, полноэкранный просмотр, стрелки и клавиши `←` `→` `Esc` |
| 💬 | **Отзывы** | Автокарусель с паузой при наведении и аватарками-инициалами |
| ❓ | **FAQ-аккордеон** | Плавное раскрытие через modern `grid-template-rows: 0fr → 1fr` |
| 📞 | **Модалка заявки** | Один модальный контекст на всё приложение: звонок, бронь конкретного тура, промокод, успех-экран |
| 📊 | **Анимированные счётчики** | Цифры начинаются с 0 при появлении в видимую зону (`IntersectionObserver` + `requestAnimationFrame`) |
| 🧭 | **Scroll-механики** | Reveal-анимации (вверх / вбок / zoom), прогресс-бар прокрутки в шапке, кнопка «наверх» |
| 📱 | **Полная адаптивность** | Бургер-меню-drawer, перестраивающиеся сетки, уважение к `prefers-reduced-motion` |

## 🧭 Страницы

| Маршрут | Страница |
|---|---|
| `/` | Главная: Hero → статистика → направления → слайдер туров → фичи → видео-баннер → отзывы → FAQ → CTA |
| `/tours` | Каталог из 12 туров с фильтрами |
| `/tours/:id` | Детальная страница тура с расчётом бронирования |
| `/calculator` | Конструктор тура |
| `/gallery` | Галерея с лайтбоксом |
| `/about` | О компании: видео-шапка, ценности, таймлайн 2012 → 2024, команда |
| `/contacts` | Контакты: форма, видео-карта Южногорска, каналы связи |
| `*` | Кастомная страница 404 |

## ⚙️ Скрипты

```bash
npm install       # 📦 установить зависимости
npm run dev       # 🚀 дев-сервер на http://localhost:5173
npm run build     # 🏗️ проверка типов (tsc -b) + сборка в dist/
npm run preview   # 👀 предпросмотр production-сборки
npm run typecheck # 🔬 только проверка типов
```

## 🌍 Публикация на GitHub Pages

1. **Создайте репозиторий** на GitHub.
2. **Запушьте проект:**

   ```bash
   git init
   git add -A
   git commit -m "🌴 Initial commit"
   git branch -M main
   git remote add origin https://github.com/skilledify/react-ts-paradise-tour.git
   git push -u origin main
   ```

3. **Включите Pages:** `Settings → Pages → Source: GitHub Actions`.
4. Готово! Push в `main` (или ручной запуск в разделе *Actions*) запускает
   workflow [`deploy.yml`](.github/workflows/deploy.yml):

   ```text
   npm ci → npm run build → upload-pages-artifact → deploy-pages
   ```

   Сайт появится на `https://skilledify.github.io/react-ts-paradise-tour/` 💫

> 💡 Workflow автоматически подставляет `BASE_PATH: /${{ github.event.repository.name }}/`,
> поэтому переименовать репозиторий — не проблема, ничего в коде править не нужно.

## 🧪 Стек

- **Vite 6** — мега-быстрая сборка, нулевой конфиг-ад
- **React 19 + React Router 7** (BrowserRouter + fallback `404.html` для GitHub Pages)
- **TypeScript 5** (`strict`), CSS-модули на **Sass**
- **GitHub Actions + GitHub Pages** — CI/CD из коробки
- ✨ **Никаких UI-библиотек**: слайдеры, лайтбокс, аккордеон, счётчики,
  модалка и прогресс-бар написаны вручную на React + Sass

## 📂 Структура проекта

```
📦 react-ts-paradise-tour
├── .github/workflows/deploy.yml     # 🤖 CI/CD → GitHub Pages
├── public/favicon.svg               # 🍃 Иконка сайта
├── src/
│   ├── components/
│   │   ├── Header/                  # Шапка: навигация, прогресс-бар, бургер
│   │   ├── Hero/                    # 🎥 Видео на пол экрана + поиск
│   │   ├── StatsBand/               # Анимированная полоса счётчиков
│   │   ├── TourCard/                # Карточка тура с избранным
│   │   ├── Slider/                  # Кастомный слайдер (autoplay, touch, dots)
│   │   ├── Reviews/                 # Карусель отзывов
│   │   ├── Faq/                     # Аккордеон
│   │   ├── VideoBanner/             # Видео-секция «За кадром»
│   │   ├── CallbackModal/           # Модалка заявки
│   │   ├── Reveal/                  # Обёртка scroll-анимаций
│   │   ├── BackToTop/               # Кнопка «наверх»
│   │   └── Footer/                  # Волна, соцсети, рассылка
│   ├── pages/
│   │   ├── Home/                    # Главная
│   │   ├── Tours/ + TourDetail/     # Каталог и страница тура
│   │   ├── Calculator/              # 🧮 Конструктор тура
│   │   ├── Gallery/                 # 🖼 Галерея + лайтбокс
│   │   ├── About/ + Contacts/       # О нас | Контакты
│   │   └── NotFound/                # 404
│   ├── context/                     # ModalContext, FavoritesContext
│   ├── data/tours.ts                # Данные: 12 туров, отзывы, медиа
│   ├── hooks/                       # useCountUp, useInView, useScrollProgress
│   ├── styles/global.scss           # Дизайн-токены, keyframes, утилиты
│   ├── App.tsx                      # Роутинг и провайдеры
│   └── main.tsx                     # Точка входа
└── README.md
```

## 🎨 Дизайн-система

| Токен | Значение |
|---|---|
| Шрифты | `Manrope` (заголовки) + `Inter` (текст) |
| Градиенты | ☀️ sunset `#ff9a00 → #ff3d7f → #7b2ff7` · 🌊 ocean `#071233 → #00b4d8` |
| Радиусы | `22px` карточки, `999px` пилюли, `10–18px` контролы |
| Анимации | `floatUp`, `floaty`, `gradShift`, `kenburns`, `pulseRing`, `planeFly`, `shine`, `marquee` |
| Тени | мягкая `--shadow-card` и неоновая `--shadow-glow` |

## 🧳 Каталог «в цифрах»

- **12 туров**: Мальдивы, Бали, Пхукет, Анталья, Шарм-эль-Шейх, Сейшелы,
  Дубай, Камчатка, Исландия, круиз по Средиземноморью, Париж, Токио, Сочи
- **4 типа отдыха**: Пляжный · Экскурсионный · Приключения · Круиз
- **9 направлений** в конструкторе и **3 уровня комфорта**

---

<div align="center">

Сделано с ❤️ и 🥥 в Южногорске · **Paradise Tour**

⭐ Поставьте звёздочку, если проект пригодился

</div>

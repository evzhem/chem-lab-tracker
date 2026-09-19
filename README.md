# ChemLab Tracker

Бесплатное мобильное приложение / PWA по химии — **без рекламы и без подписки**.

**Сайт:** https://evzhem.github.io/chem-lab-tracker/

**Установка на телефон:** https://evzhem.github.io/chem-lab-tracker/#/install

**APK (Android):** https://github.com/evzhem/chem-lab-tracker/releases/latest

## Возможности (всё открыто)

| Раздел | Содержание |
|--------|------------|
| **Реакции** | Поиск уравнений по веществам |
| **Таблица** | Полная таблица Менделеева + карточки элементов |
| **Растворимость** | Таблица с ориентировочными г/100 мл |
| **Молярная масса** | Формулы, гидраты, скобки, расчёт растворов |
| **Схемы** | Ряды активности, потенциалы, кислоты, ТБ |
| **Дневник** | Опыты в localStorage (офлайн) |

## Установка на телефон

### 1. PWA (iOS / Android, из браузера)

1. Откройте сайт в Chrome (Android) или Safari (iPhone).
2. **Android:** меню → «Установить приложение».
3. **iPhone:** Поделиться → «На экран „Домой“».

### 2. APK (Android)

1. Откройте [Releases](https://github.com/evzhem/chem-lab-tracker/releases/latest).
2. Скачайте `ChemLabTracker.apk`.
3. Разрешите установку из неизвестных источников и установите.

APK собирается GitHub Actions (workflow **Build Android APK**).  
Запуск вручную: Actions → Build Android APK → Run workflow.  
Или тег: `git tag v1.1.0 && git push origin v1.1.0`.

## Стек

- React (Vite) + Tailwind CSS + lucide-react  
- HashRouter, `base: '/chem-lab-tracker/'` (GitHub Pages)  
- PWA: `vite-plugin-pwa`  
- Android: Capacitor  

## Локально

```bash
npm install
npm run dev
npm run build
```

Сборка веб-части под APK:

```bash
npm run build:apk-web
npx cap add android   # один раз
npx cap sync android
```

## Лицензия

MIT · учебный open-source проект. Не является клоном коммерческих приложений — свой UI и данные.

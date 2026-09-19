# ChemLab Tracker

Бесплатное мобильное приложение / PWA по химии — **без рекламы и без подписки**.

**Сайт:** https://evzhem.github.io/chem-lab-tracker/

**Установка на телефон:** https://evzhem.github.io/chem-lab-tracker/#/install

**APK (Android, всегда свежий):** https://github.com/evzhem/chem-lab-tracker/releases/download/apk-latest/ChemLabTracker.apk  

**Все версии APK (Releases):** https://github.com/evzhem/chem-lab-tracker/releases  

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

1. Откройте [Releases](https://github.com/evzhem/chem-lab-tracker/releases) — справа на странице репозитория блок **Releases**.
2. Скачайте `ChemLabTracker.apk` у нужной версии (или с [apk-latest](https://github.com/evzhem/chem-lab-tracker/releases/tag/apk-latest)).
3. На телефоне: разрешите установку из неизвестных источников → откройте файл.

**Как появляются обновления APK**

| Событие | Что происходит |
|--------|----------------|
| Push / merge в `main` | Actions → **Build Android APK** → новый релиз `v1.1.0-N` + обновление `apk-latest` |
| Ручной запуск | Actions → Build Android APK → **Run workflow** |
| Тег `v1.2.0` | Релиз с именем тега |

Прямая ссылка на последний APK (можно в README / на сайте):

```
https://github.com/evzhem/chem-lab-tracker/releases/download/apk-latest/ChemLabTracker.apk
```

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

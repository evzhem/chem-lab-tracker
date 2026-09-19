# ChemLab Tracker

Мобильное PWA-подобное приложение для дневника лабораторных опытов, расчёта молярной массы и быстрого справочника по химии.

**Сайт:** https://evzhem.github.io/chem-lab-tracker/

## Стек

- React (Vite) + Tailwind CSS + lucide-react
- HashRouter (`react-router-dom`)
- Данные дневника — в `localStorage`
- GitHub Pages (`base: '/chem-lab-tracker/'`)

## Экраны

1. **Дневник** — создание опытов, статусы, чек-лист шагов, наблюдения
2. **Калькулятор** — молярная масса (скобки, комплексы, кристаллогидраты) и `m = C · V · M`
3. **Справочник** — растворимость, ряд активности, кислоты
4. **ТБ** — карточки техники безопасности

## Локальный запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Деплой

Workflow `.github/workflows/deploy.yml` публикует `dist` на GitHub Pages при пуше в `main`.

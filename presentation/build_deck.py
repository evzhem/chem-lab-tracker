#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Сборка презентации по проекту ChemLab Tracker (v2, с авторасчётом высоты блоков).

Каждый слайд: заголовок, тезисы, реальный фрагмент кода и заметки для доклада.
Позиции блоков считаются из длины текста, поэтому строки не наезжают друг на друга.
"""
import math
import re
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.dml import MSO_LINE_DASH_STYLE

OUT = '/home/user/presentation/ChemLab-Tracker-презентация.pptx'

VIOLET = RGBColor(0x7C, 0x3A, 0xED)
VIOLET_DARK = RGBColor(0x3B, 0x0F, 0x6B)
CYAN = RGBColor(0x06, 0xB6, 0xD4)
INK = RGBColor(0x1F, 0x29, 0x37)
MUTED = RGBColor(0x5B, 0x67, 0x78)
LIGHT = RGBColor(0xF5, 0xF3, 0xFF)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
CODE_BG = RGBColor(0x0F, 0x17, 0x2A)
CODE_TEXT = RGBColor(0xE2, 0xE8, 0xF0)
CODE_COMMENT = RGBColor(0x7D, 0xD3, 0x9B)
CODE_STRING = RGBColor(0xFD, 0xD0, 0x8A)
CODE_KEY = RGBColor(0xC4, 0xB5, 0xFD)
CODE_NUM = RGBColor(0x93, 0xC5, 0xFD)

SLIDE_W_IN, SLIDE_H_IN = 13.333, 7.5
SLIDE_W = Inches(SLIDE_W_IN)
SLIDE_H = Inches(SLIDE_H_IN)
MARGIN = 0.75
BODY_W = SLIDE_W_IN - 2 * MARGIN
BOTTOM_LIMIT = 7.02          # ниже этой линии ничего не ставим (там колонтитул)

KEYWORDS = {
    'const', 'let', 'var', 'function', 'return', 'import', 'from', 'export', 'default',
    'if', 'else', 'for', 'while', 'new', 'await', 'async', 'class', 'try', 'catch',
    'throw', 'typeof', 'true', 'false', 'null', 'undefined', 'of', 'in', 'name', 'on',
    'jobs', 'steps', 'uses', 'run', 'with', 'permissions', 'env', 'push', 'branches',
    'tags', 'workflow_dispatch', 'else',
}

prs = Presentation()
prs.slide_width = SLIDE_W
prs.slide_height = SLIDE_H
BLANK = prs.slide_layouts[6]


# ------------------------- измерение текста -------------------------
def text_lines(text, width_in, size_pt, mono=False):
    """Сколько строк займёт текст в блоке заданной ширины."""
    char_w = (0.56 if mono else 0.53) * size_pt / 72.0
    per_line = max(1, int(width_in / char_w))
    total = 0
    for chunk in text.split('\n'):
        total += max(1, math.ceil(len(chunk) / per_line))
    return total


def bullets_height(items, size):
    lines = 0
    for item in items:
        text = (item[0] + item[1]) if isinstance(item, tuple) else item
        lines += text_lines(text, BODY_W - 0.25, size)
    return lines * size * 1.22 / 72.0


def code_height(code, size):
    return len(code.strip('\n').split('\n')) * size * 1.22 / 72.0 + 0.26


# ------------------------- рисование -------------------------
def add_box(slide, x, y, w, h, fill=None, radius=None):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE, x, y, w, h
    )
    if radius is not None:
        shape.adjustments[0] = radius
    if fill is None:
        shape.fill.background()
    else:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    shape.shadow.inherit = False
    return shape


def add_text(slide, x_in, y_in, w_in, h_in, runs, size=16, color=INK, bold=False,
             align=PP_ALIGN.LEFT, spacing=1.15, anchor=MSO_ANCHOR.TOP, font='Arial'):
    box = slide.shapes.add_textbox(Inches(x_in), Inches(y_in), Inches(w_in), Inches(h_in))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    if isinstance(runs, str):
        runs = [[(runs, {})]]
    first = True
    for para in runs:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = align
        p.line_spacing = spacing
        for text, opts in para:
            r = p.add_run()
            r.text = text
            r.font.size = Pt(opts.get('size', size))
            r.font.bold = opts.get('bold', bold)
            r.font.color.rgb = opts.get('color', color)
            r.font.name = opts.get('font', font)
    return box


def code_runs(line):
    out = []
    comment = ''
    stripped = line.lstrip()
    if stripped.startswith('#'):
        return [(line, CODE_COMMENT)]
    for marker in ('//', '#'):
        idx = line.find(marker)
        if idx != -1:
            comment, line = line[idx:], line[:idx]
            break
    pattern = re.compile(r"('[^']*'|\"[^\"]*\"|\b\d+(?:\.\d+)?\b|[A-Za-zА-Яа-я_$][\w$.-]*)")
    pos = 0
    for m in pattern.finditer(line):
        if m.start() > pos:
            out.append((line[pos:m.start()], CODE_TEXT))
        token = m.group(0)
        if token.startswith(("'", '"')):
            out.append((token, CODE_STRING))
        elif token in KEYWORDS:
            out.append((token, CODE_KEY))
        elif re.fullmatch(r'\d+(\.\d+)?', token):
            out.append((token, CODE_NUM))
        else:
            out.append((token, CODE_TEXT))
        pos = m.end()
    if pos < len(line):
        out.append((line[pos:], CODE_TEXT))
    if comment:
        out.append((comment, CODE_COMMENT))
    return out or [('', CODE_TEXT)]


def draw_code(slide, code, y_in, size, caption=None):
    x_in = MARGIN
    if caption:
        add_text(slide, x_in, y_in - 0.27, BODY_W, 0.24, caption, size=10.5,
                 color=MUTED, bold=True)
    h_in = code_height(code, size)
    box = add_box(slide, Inches(x_in), Inches(y_in), Inches(BODY_W), Inches(h_in),
                  fill=CODE_BG, radius=0.06)
    tf = box.text_frame
    tf.word_wrap = False
    tf.margin_left = Inches(0.16)
    tf.margin_right = Inches(0.1)
    tf.margin_top = Inches(0.09)
    tf.margin_bottom = Inches(0.06)
    first = True
    for line in code.strip('\n').split('\n'):
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.line_spacing = 1.0
        p.space_after = Pt(0)
        for text, color in code_runs(line):
            r = p.add_run()
            r.text = text
            r.font.size = Pt(size)
            r.font.name = 'Consolas'
            r.font.color.rgb = color
    return y_in + h_in


def draw_bullets(slide, items, y_in, size):
    runs = []
    for item in items:
        if isinstance(item, tuple):
            head, tail = item
            runs.append([('▸ ', {'color': VIOLET, 'bold': True}),
                         (head, {'bold': True}), (tail, {})])
        else:
            runs.append([('▸ ', {'color': VIOLET, 'bold': True}), (item, {})])
    add_text(slide, MARGIN, y_in, BODY_W, bullets_height(items, size) + 0.3,
             runs, size=size, spacing=1.22)
    return bullets_height(items, size)


def header(slide, title, kicker=None, number=None):
    add_box(slide, 0, 0, SLIDE_W, Inches(0.16), fill=VIOLET)
    top = 0.42
    if kicker:
        add_text(slide, MARGIN, top, 11, 0.3, kicker, size=11.5, color=CYAN, bold=True)
        top = 0.72
    add_text(slide, MARGIN, top, 11.5, 0.62, title, size=25, color=VIOLET_DARK, bold=True)
    add_box(slide, Inches(MARGIN + 0.03), Inches(top + 0.58), Inches(1.4), Pt(3), fill=CYAN)
    if number:
        add_text(slide, SLIDE_W_IN - 1.45, 6.9, 0.7, 0.3, str(number), size=10.5,
                 color=MUTED, align=PP_ALIGN.RIGHT)
    add_text(slide, MARGIN, 6.9, 8, 0.3, 'ChemLab Tracker · приложение-справочник по химии',
             size=10, color=MUTED)


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text.strip()


COUNTER = {'n': 1}


def next_number():
    COUNTER['n'] += 1
    return COUNTER['n']


def content_slide(title, kicker, number=None, bullets=None, code=None, caption=None,
                  bullet_size=14.5, code_size=12):
    """Слайд: заголовок → тезисы → код. Высоты считаются, размеры подбираются."""
    slide = prs.slides.add_slide(BLANK)
    header(slide, title, kicker, next_number())
    y = 1.52
    if bullets:
        bullets = list(bullets)
        # подбираем размер тезисов, чтобы всё уместилось с блоком кода
        for size in (bullet_size, bullet_size - 1, bullet_size - 2, 12):
            bh = bullets_height(bullets, size)
            code_need = code_height(code, code_size) + (0.32 if caption else 0) if code else 0
            if y + bh + (0.3 if code else 0) + code_need + (0.28 if code else 0) <= BOTTOM_LIMIT:
                break
        y += draw_bullets(slide, bullets, y, size) + (0.3 if code else 0)
    if code:
        # подбираем размер кода, если он не влезает
        size = code_size
        while y + (0.32 if caption else 0) + code_height(code, size) > BOTTOM_LIMIT and size > 8.5:
            size -= 0.5
        draw_code(slide, code, y + (0.3 if caption else 0), size, caption)
    return slide


# =========================== СЛАЙДЫ ===========================

# --- 1. Титул ---
s = prs.slides.add_slide(BLANK)
add_box(s, 0, 0, SLIDE_W, SLIDE_H, fill=RGBColor(0x14, 0x0B, 0x2A))
add_box(s, 0, 0, Inches(0.35), SLIDE_H, fill=VIOLET)
add_text(s, 1.1, 1.45, 6.6, 0.4, 'ПРОЕКТНАЯ РАБОТА', size=15, color=CYAN, bold=True)
add_text(s, 1.1, 1.95, 10.6, 1.2, 'ChemLab Tracker', size=52, color=WHITE, bold=True)
add_text(s, 1.1, 3.1, 10.2, 0.9,
         'мобильное приложение-справочник по химии: реакции, таблица Менделеева,\n'
         'растворимость, молярная масса, справочные схемы и дневник опытов',
         size=16.5, color=LIGHT, spacing=1.3)
add_box(s, Inches(1.13), Inches(4.25), Inches(2.2), Pt(3), fill=CYAN)
add_text(s, 1.1, 4.55, 9, 1.0,
         [[('Технологии: ', {'bold': True, 'color': WHITE}),
           ('React · Vite · Tailwind CSS · PWA · Capacitor (Android)', {'color': LIGHT})],
          [('Формат: ', {'bold': True, 'color': WHITE}),
           ('сайт (PWA) и приложение для Android (APK), работают офлайн', {'color': LIGHT})]],
         size=14, spacing=1.5)
add_text(s, 1.1, 6.05, 10.6, 0.8,
         [[('Выполнил: ', {'bold': True, 'color': LIGHT}),
           ('Фамилия Имя, группа ______', {'color': LIGHT})],
          [('Руководитель: ', {'bold': True, 'color': LIGHT}),
           ('______________________', {'color': LIGHT})]],
         size=13, spacing=1.35)
notes(s, """
Добрый день. Тема моей работы — приложение-справочник по химии ChemLab Tracker.
Идея была сделать не сайт, а именно приложение для телефона, которым можно пользоваться
на уроке или в лаборатории: без интернета и без регистрации.
В работе я собирал данные по химии, проектировал интерфейс под телефон, писал код
на React и затем упаковал всё в Android-приложение.
""")

# --- 2. Проблема и цель ---
s = content_slide('Проблема, цель и задачи', 'ЗАЧЕМ Я ЭТО ДЕЛАЛ', 2, bullets=[
    ('Проблема: ', 'обычные справочники — либо книги, либо сайты с рекламой, которые не работают без интернета.'),
    ('Цель: ', 'приложение на телефоне, где вся нужная справочная информация под рукой — офлайн.'),
    ('Задача 1: ', 'собрать и структурировать химические данные в удобном для программы виде.'),
    ('Задача 2: ', 'спроектировать интерфейс под маленький экран (управление одной рукой).'),
    ('Задача 3: ', 'написать разделы: реакции, таблица Менделеева, растворимость, молярная масса, схемы, дневник.'),
    ('Задача 4: ', 'сделать хранение данных на устройстве и работу без интернета.'),
    ('Задача 5: ', 'настроить автоматическую сборку: публикация сайта и сборка APK для Android.'),
], code="""
Критерии, по которым я оценивал результат:
  1) после первого запуска приложение работает без интернета
  2) открывается на телефоне как обычное приложение (иконка на рабочем столе)
  3) данные ученика не уходят на сервер — всё хранится на устройстве
  4) разделы открываются мгновенно, без загрузок и «крутилок»
""", caption='Требования, которые я поставил перед началом работы', code_size=12)
notes(s, """
Сначала я сформулировал проблему: на уроке химии телефон обычно под рукой, но нужного
справочника в нём нет — либо это сайт с рекламой, либо приложение с подпиской,
либо в кабинете просто нет интернета.
Поэтому цель — собрать один справочник, который всегда с собой.
Я разбил работу на пять задач: данные, интерфейс, разделы, хранение данных и сборка.
Отдельно записал четыре критерия: работа офлайн, установка на телефон, хранение данных
только на устройстве и мгновенное открытие разделов.
""")

# --- 3. Что умеет ---
s = content_slide('Что умеет приложение', 'ГОТОВЫЙ РЕЗУЛЬТАТ', 3, bullets=[
    ('Реакции — ', 'поиск уравнений: «NaOH+HCl» или «CuSO4» находит реакции с пояснением.'),
    ('Таблица Менделеева — ', '118 элементов; нажатие открывает карточку (масса, конфигурация, степени окисления).'),
    ('Растворимость — ', 'таблица «24 катиона × 18 анионов» со значениями в г/100 мл воды.'),
    ('Молярная масса — ', 'расчёт по формуле, включая скобки и гидраты: Fe2(SO4)3, CuSO4·5H2O.'),
    ('Схемы — ', 'ряд активности металлов, электроотрицательность, потенциалы, кислоты, техника безопасности.'),
    ('Дневник опытов — ', 'цель, реактивы, шаги, наблюдения; записи хранятся на устройстве и доступны офлайн.'),
    ('Настройки — ', 'тема оформления (тёмная / AMOLED), проверка обновлений, очистка дневника.'),
], code="""
Разделы приложения (9 экранов):
  /            Реакции              /schemes     Схемы и справочники
  /table       Таблица Менделеева   /journal     Дневник опытов
  /solubility  Растворимость        /settings    Настройки
  /calc        Молярная масса       /safety      Техника безопасности
""", caption='Адреса разделов приложения', bullet_size=14, code_size=12)
notes(s, """
В итоге получилось девять экранов. Первые пять — справочник: реакции с поиском, таблица
Менделеева с карточками элементов, таблица растворимости, калькулятор молярной массы и раздел
со схемами — ряды активности, электроотрицательности, потенциалы и кислоты.
Шестой экран — дневник опытов: цель, реактивы, шаги, наблюдения и отметки о выполнении.
Седьмой — настройки: тема, проверка обновлений, очистка дневника.
Ещё два экрана — карточка отдельного опыта и техника безопасности.
""")

# --- 3.5 Скриншоты (рамки под вставку своих снимков) ---
s = prs.slides.add_slide(BLANK)
header(s, 'Приложение на экране телефона', 'КАК ЭТО ВЫГЛЯДИТ', next_number())
frames = ['Главный экран: поиск реакций', 'Таблица Менделеева: масштаб',
          'Растворимость: значения', 'Дневник опыта: шаги и наблюдения']
fw, fh, gap = 2.62, 3.95, 0.42
fx = MARGIN
for title in frames:
    ph = add_box(s, Inches(fx), Inches(1.62), Inches(fw), Inches(fh),
                 fill=RGBColor(0xF7, 0xF5, 0xFF), radius=0.05)
    ph.line.color.rgb = RGBColor(0xC4, 0xB5, 0xFD)
    ph.line.width = Pt(1.5)
    ph.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    add_text(s, fx + 0.18, 2.3, fw - 0.36, 2.6,
             'сюда вставить скриншот\nэкран телефона', size=11, color=MUTED,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, fx + 0.14, 5.66, fw - 0.28, 0.42, title, size=10.5, color=VIOLET_DARK,
             bold=True, align=PP_ALIGN.CENTER, spacing=1.1)
    fx += fw + gap
draw_bullets(s, [
    'Скриншоты я снимал прямо на телефоне: одновременно кнопки питания и уменьшения громкости.',
    'Вставить: вкладка «Вставка» → «Рисунок», затем наложить снимок на рамку (рамку можно удалить).',
], 6.12, 12.5)
notes(s, """
Пару слов о том, как это выглядит вживую. Вот четыре основных экрана: главный с открытым
поиском реакций, таблица Менделеева с масштабом, таблица растворимости и дневник опыта.
Здесь у меня подготовлены рамки — на защите я вставлю сюда настоящие скриншоты с телефона.
""")


# --- 4. Стек ---
s = content_slide('Стек технологий и почему именно он', 'ИНСТРУМЕНТЫ', 4, bullets=[
    ('React 19 — ', 'интерфейс собирается из компонентов, состояние — через хуки (useState, useEffect, useMemo).'),
    ('Vite — ', 'сборка и dev-сервер: моментальная перезагрузка при правке кода.'),
    ('Tailwind CSS — ', 'стили пишутся классами прямо в разметке; проще держать единый вид на всех экранах.'),
    ('React Router (HashRouter) — ', 'переходы между разделами без перезагрузки страницы.'),
    ('vite-plugin-pwa — ', 'офлайн-режим и установка приложения из браузера.'),
    ('Capacitor — ', 'тот же веб-код упаковывается в APK для Android, вторую версию писать не нужно.'),
    ('localStorage — ', 'хранение дневника и настроек на устройстве, без сервера и базы данных.'),
], code="""
"dependencies": {
  "react": "^19.2.8",  "react-dom": "^19.2.8",
  "react-router-dom": "^7.18.4",      // навигация по разделам
  "lucide-react": "^1.47.0",          // иконки интерфейса
  "@capacitor/android": "^8.5.2"      // сборка APK
},
"devDependencies": {
  "vite": "^8.3.0", "@tailwindcss/vite": "^4.3.3",
  "vite-plugin-pwa": "^1.3.0"         // офлайн-режим и установка
}
""", caption='package.json — реальные зависимости проекта', bullet_size=13.5, code_size=11.5)
notes(s, """
Технологии я выбирал по одному принципу: чтобы один и тот же код работал и в браузере,
и как приложение на Android, и при этом не требовал сервера.
React удобен тем, что интерфейс собирается из независимых компонентов, а состояние хранится
рядом с ними. Vite даёт быструю сборку и моментальную перезагрузку при правках.
Tailwind ускоряет вёрстку и не даёт расползтись стилям. Для навигации — React Router,
для офлайна — плагин PWA, а Capacitor «оборачивает» готовую сборку в APK.
Базу данных я сознательно не использовал: справочные данные не меняются, их удобнее держать
в коде, а пользовательские данные — в localStorage на устройстве.
""")

# --- 5. Архитектура ---
s = content_slide('Архитектура: что с чем связано', 'КАК УСТРОЕНО ПРИЛОЖЕНИЕ', 5, bullets=[
    'Данные лежат отдельно от интерфейса: чтобы добавить элемент или реакцию, код экранов менять не нужно.',
    'Общую логику я вынес в src/lib, чтобы не дублировать её по страницам: работу с дневником используют и список, и карточка опыта.',
    'Компоненты (Layout, ZoomControls, UpdateNotice) — переиспользуемые части интерфейса, они не знают, на каком экране находятся.',
], code="""
   src/data/*.js            справочные данные (не меняются)
   элементы · реакции · растворимость · схемы · история версий
        │  импорт данных
        ▼
   src/pages/*.jsx          разделы: Reactions, PeriodicTable, Solubility,
        │  ▲                Calculator, Schemes, Journal, Settings
        │  │  чтение/запись дневника и настроек
        ▼  │
   src/lib/*.js             общая логика: storage (localStorage), molarMass
        │                   (парсер формул), theme, updates, pwa
        ▼
   localStorage · service worker (офлайн) · Capacitor (сборка APK)
""", caption='Поток данных: данные → разделы → общая логика → устройство', bullet_size=13.5, code_size=11)
notes(s, """
Это схема связей в проекте. Сверху — данные: массивы элементов, реакций, таблица
растворимости, схемы. Они не зависят от интерфейса.
Из данных собираются экраны в папке pages. Экраны не обращаются друг к другу напрямую:
общее вынесено в папку lib — это хранение данных, парсер формул, темы и проверка обновлений.
Внизу то, чем всё заканчивается: localStorage на устройстве, service worker для офлайн-режима
и Capacitor, который превращает сборку в APK.
Такое разделение позволило добавлять новые разделы, почти не трогая существующие.
""")

# --- 6. Структура ---
s = content_slide('Структура проекта', 'ФАЙЛЫ И ПАПКИ', 6, bullets=[
    'Деление по смыслу: данные отдельно, интерфейс отдельно, общая логика отдельно.',
    'Файлы в lib не рисуют интерфейс, а pages не работают с localStorage напрямую — они вызывают функции из lib.',
], code="""
chem-lab-tracker/
├── src/
│   ├── components/   Layout (шапка и меню), ZoomControls (масштаб таблиц),
│   │                 UpdateDialog и UpdateNotice (окно и карточка обновления)
│   ├── data/         chemistry, elements, reactions, schemes, solubility, changelog
│   ├── lib/          storage, molarMass, theme, updates, pwa, appInfo
│   ├── pages/        Reactions, PeriodicTable, Solubility, Calculator,
│   │                 Schemes, Journal, Experiment, Settings, Safety
│   ├── App.jsx       маршруты: какой адрес — какой экран
│   ├── main.jsx      точка входа: темы, проверка обновлений, запуск приложения
│   └── index.css     базовые стили, тема (CSS-переменные), оформление таблиц
├── .github/workflows/   deploy.yml (сайт), build-apk.yml (сборка APK)
├── vite.config.js    сборка, PWA-манифест, генерация version.json
└── package.json      зависимости и команды (dev, build, lint)
""", caption='Структура репозитория', bullet_size=13.5, code_size=11)
notes(s, """
Про структуру. Компоненты — то, что повторно используется: общий каркас с шапкой и меню,
блок управления масштабом таблиц, окно и карточка обновления.
В папке data — сами справочные данные, по файлу на тему.
В lib — логика, которую используют несколько экранов: работа с localStorage, расчёт молярной
массы, темы и проверка обновлений. В pages — сами экраны.
Плюс App.jsx с маршрутами и main.jsx — точка входа.
Отдельно в workflows лежат сценарии автоматической сборки сайта и APK.
""")

# --- 7. Точка входа ---
s = content_slide('Точка входа: как запускается приложение', 'СВЯЗЬ КОМПОНЕНТОВ · src/main.jsx', 7, bullets=[
    'Приложение обёрнуто в два «провайдера»: тема и проверка обновлений доступны любому экрану без передачи пропсов вручную.',
    'Порядок обёрток важен: тема снаружи, поэтому применяется раньше, чем отрисуются экраны.',
    'ThemeProvider меняет атрибут data-theme у <html>, а UpdateProvider показывает окно обновления, если вышла новая версия.',
    'registerServiceWorker() до отрисовки: service worker кэширует файлы, и приложение открывается без интернета.',
], code="""
registerServiceWorker()          // регистрация service worker — офлайн-режим

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>              {/* тема: тёмная или AMOLED */}
      <UpdateProvider>           {/* тихая проверка обновлений при запуске */}
        <App />                  {/* маршруты и экраны */}
      </UpdateProvider>
    </ThemeProvider>
  </StrictMode>,
)
""", caption='src/main.jsx', bullet_size=13, code_size=12)
notes(s, """
Это файл main.jsx — точка входа, с него начинается запуск.
Сначала регистрируется service worker: это механизм браузера, который сохраняет файлы
приложения в кэш, поэтому потом оно открывается без интернета.
Дальше приложение отрисовывается в элемент с id root. Внутри — два провайдера.
Провайдер — это способ отдать данные сразу всем экранам. ThemeProvider хранит выбранную тему
и вешает её атрибутом на html, а UpdateProvider проверяет, не вышла ли новая версия.
App внутри — это уже сами экраны и маршруты.
Порядок вложенности не случаен: тема должна применяться раньше остальных.
""")

# --- 8. Роутинг ---
s = content_slide('Навигация между разделами', 'МАРШРУТЫ · src/App.jsx', 8, bullets=[
    ('Почему HashRouter: ', 'адреса выглядят как #/table. Сайт размещён на GitHub Pages, где нельзя настроить сервер: при обычных путях обновление страницы давало бы ошибку 404.'),
    ('Вложенный маршрут: ', 'Layout один для всех экранов, поэтому при переходе меняется только содержимое, а меню и шапка не перерисовываются.'),
    ('Последняя строка со звёздочкой: ', 'неизвестный адрес уводит на главный экран вместо пустой страницы.'),
], code="""
<HashRouter>
  <Routes>
    <Route element={<Layout />}>              {/* общий каркас для всех экранов */}
      <Route index element={<Reactions />} />
      <Route path="table" element={<PeriodicTable />} />
      <Route path="solubility" element={<Solubility />} />
      <Route path="calc" element={<Calculator />} />
      <Route path="schemes" element={<Schemes />} />
      <Route path="journal" element={<Journal />} />
      <Route path="settings" element={<Settings />} />
      <Route path="install" element={<Navigate to="/settings" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
</HashRouter>
""", caption='src/App.jsx — карта приложения', bullet_size=13, code_size=11.5)
notes(s, """
Здесь описаны маршруты: какой адрес соответствует какому экрану.
Все экраны вложены в один маршрут с Layout, то есть у них общий каркас: шапка и нижнее меню.
При переходе между разделами Layout не перерисовывается, меняется только содержимое — поэтому
приложение не «моргает» и разделы открываются мгновенно.
Я использовал HashRouter, то есть адреса с решёткой. Это осознанное решение: сайт лежит
на GitHub Pages, где нет своего сервера, и при обычных путях перезагрузка страницы дала бы
ошибку 404. С решёткой адрес обрабатывается целиком на стороне браузера.
""")

# --- 9. Layout ---
s = content_slide('Каркас интерфейса', 'СВЯЗЬ LAYOUT И ЭКРАНОВ · src/components/Layout.jsx', 9, bullets=[
    'Outlet — это «окно», в которое подставляется открытый раздел: сам Layout ничего не знает о содержимом экранов.',
    'Меню закреплено снизу — на телефоне до него удобно дотянуться большим пальцем.',
    'env(safe-area-inset-bottom) — системный отступ для полосы жестов на iPhone, чтобы меню не перекрывалось.',
    'NavLink сам знает, активен ли раздел, поэтому не пришлось писать своё состояние «какая вкладка выбрана».',
], code="""
<main className="flex-1 overflow-y-auto px-4 pb-28">
  <Outlet />          {/* сюда React Router подставляет текущий раздел */}
</main>

<nav className="app-bar fixed bottom-0 left-0 right-0"
     style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}>
  <div className="grid grid-cols-5">
    {tabs.map(({ to, icon: Icon, label }) => (
      <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}>
        <Icon size={22} /> <span>{label}</span>
      </NavLink>
    ))}
  </div>
</nav>
""", caption='src/components/Layout.jsx (сокращённо)', bullet_size=13, code_size=11)
notes(s, """
Layout — общий каркас приложения. Сверху шапка: логотип и название текущего раздела,
кнопка настроек. Снизу — меню из пяти разделов.
Ключевая строка — Outlet. Это место, куда роутер подставляет открытый раздел. Благодаря этому
Layout не знает, какой экран внутри, а экраны не знают про меню — они независимы.
Заголовок в шапке берётся из словаря по адресу, а не прописан в каждом экране отдельно.
Меню закреплено внизу: на телефоне это удобнее. Отступ safe-area нужен из-за системной полосы
жестов на iPhone — без него последняя строка меню оказалась бы под ней.
""")

# --- 10. Данные ---
s = content_slide('Данные: откуда приложение берёт информацию', 'СВЯЗЬ ДАННЫХ И ИНТЕРФЕЙСА · src/data', 10, bullets=[
    'Данные я держу в отдельных файлах: их легко дополнять и проверять, а интерфейс от них не зависит.',
    'Поле cat связывает элемент с категорией: из неё берётся цвет клетки в таблице и подпись в легенде.',
    'Поле reagents со «обычными» цифрами (H2O) добавлено специально — по нему поиск работает, даже если пользователь не вводит индексы.',
    'Всего в приложении: 118 элементов, 40 реакций, таблица растворимости 24 × 18, а также ряды и справочные схемы.',
], code="""
// src/data/elements.js — один элемент справочника
{ z: 29, sym: 'Cu', name: 'Медь', mass: 63.546, period: 4, group: 11,
  cat: 'transition', electron: '3d¹⁰ 4s¹', oxidation: '+1, +2' }

// src/data/reactions.js — одна реакция
{ id: 'naoh-hcl',
  eq: 'NaOH + HCl → NaCl + H₂O',
  type: 'обмен',
  reagents: ['NaOH', 'HCl', 'NaCl', 'H2O'],       // по этому полю идёт поиск
  note: 'Нейтрализация: щёлочь + кислота → соль + вода.' }
""", caption='Формат записей: обычные JS-объекты', bullet_size=13, code_size=11.5)
notes(s, """
Данные в приложении — это обычные объекты JavaScript. Я вынес их в отдельную папку, чтобы код
интерфейса не смешивался со справочником.
У элемента есть номер, символ, название, масса, период, группа, категория, электронная
конфигурация и степени окисления. Поле категории связывает данные с оформлением: именно из
него берётся цвет клетки.
У реакции — уравнение, тип, список реагентов и пояснение. Массив реагентов нужен для поиска.
Всего я собрал 118 элементов, сорок реакций и таблицу растворимости 24 на 18.
""")

# --- 11. Поиск реакций ---
s = content_slide('Как работает поиск реакций', 'ЛОГИКА + ДАННЫЕ · src/data/reactions.js', 11, bullets=[
    'Пользователь может ввести «H2O», «H₂O», «NaOH+HCl» или «CuSO4» — всё приводится к одному виду.',
    'Индексы (₂, ₃) заменяются обычными цифрами, поэтому индекс в запросе можно не набирать.',
    'Запрос делится по «+», «→», «=»: приложение ищет уравнение, в котором встречаются все указанные вещества.',
    'Данных немного (40 реакций), поэтому поиск идёт простым перебором — результат мгновенный, база данных не нужна.',
], code="""
export function searchReactions(query) {
  const q = query.trim().toLowerCase().replace(/\\s+/g, '')
  if (!q) return []
  const parts = q.split(/[+,\\u2192\\u21cc=]/).map((s) => s.trim()).filter(Boolean)

  return REACTIONS.filter((r) => {
    const hay = (r.eq + ' ' + r.reagents.join(' ') + ' ' + r.note)
      .toLowerCase()
      .replace(/[\\u2082\\u2083\\u2084\\u2085\\u2086\\u2087\\u2088\\u2089\\u2070\\u00b9\\u207b\\u207a\\u2193\\u2191\\u00b7]/g, (ch) => SUB[ch] ?? ch)  // H₂O → H2O
      .replace(/\\s+/g, '')
    if (hay.includes(q)) return true
    // если введены несколько веществ: NaOH+HCl — ищем уравнение, где есть все
    return parts.every((p) => hay.includes(p) || r.reagents.some((x) => x.includes(p)))
  })
}
""", caption='src/data/reactions.js — функция searchReactions (сокращённый фрагмент)', bullet_size=13, code_size=10.5)
notes(s, """
Поиск реакций — главный пример связки «данные + логика».
У каждой реакции есть уравнение, массив реагентов и пояснение. Функция берёт запрос
пользователя, приводит его к нижнему регистру и убирает пробелы.
Отдельная важная деталь — замена нижних индексов на обычные цифры. В базе уравнение записано
красиво: H₂O, а пользователь на клавиатуре телефона набирает H2O. Без этой замены поиск
не находил бы ничего.
Дальше запрос делится по плюсу и стрелке: если введено «NaOH + HCl», приложение ищет реакцию,
где встречаются оба вещества, а не только первое.
Перебор по сорока реакциям занимает миллисекунды, поэтому база данных здесь не нужна,
""")

# --- 12. Молярная масса ---
s = content_slide('Калькулятор молярной массы: разбор формулы', 'ПАРСЕР СТРОК · src/lib/molarMass.js', 12, bullets=[
    'Формула разбирается посимвольно в токены — так корректно обрабатываются элементы из двух букв (Cl, Fe) и числа после них.',
    'Скобки считаются рекурсией: внутренняя часть обрабатывается отдельным вызовом и умножается на коэффициент за скобкой.',
    'Гидраты (CuSO4·5H2O) — отдельная ветка: точка, «·», «•» и «×» считаются разделителем, а не десятичной точкой.',
    'Ошибки объясняются словами: «Нет закрывающей скобки», «Элемент Xx не найден в базе».',
], code="""
normalizeFormula('CuSO4\\u00b75H2O')   // \\u00b7 \\u2022 \\u00d7 и точка → знак гидрата: 'CuSO4*5H2O'

tokenize(formula)                // H2SO4 → [H] [2] [S] [O] [4]
  if (/[A-Z]/.test(c)) {         // элемент: заглавная буква + строчные (Cl, Fe, Na)
    let el = c; while (/[a-z]/.test(s[i])) el += s[i++]
    tokens.push({ type: 'el', value: el })
  }

parseGroup(tokens, i)            // рекурсия для скобок: Fe2(SO4)3
  const [inner, ni] = parseGroup(tokens, i + 1)   // считаем содержимое скобок
  let mul = 1
  if (tokens[ni]?.type === 'num') mul = tokens[ni].value
  for (const [el, n] of Object.entries(inner)) add(el, n * mul)

const sub = info.mass * n        // масса = атомная масса × количество атомов
""", caption='src/lib/molarMass.js — три шага разбора формулы', bullet_size=13, code_size=10.5)
notes(s, """
Калькулятор молярной массы — самая «алгоритмическая» часть проекта, здесь я писал разбор строки.
Работа идёт в три шага. Первый — нормализация: разные обозначения гидратов приводятся
к одному виду, потому что точку в формуле человек понимает как разделитель, а не как запятую.
Второй шаг — токенизация: строка режется на элементы и числа. Важно, что элемент может
состоять из двух букв: хлор пишется Cl, железо Fe. Мой разбор читает заглавную букву
и добавляет к ней строчные.
Третий шаг — подсчёт с рекурсией: если встречается скобка, я рекурсивно считаю то, что внутри,
и умножаю на число после скобки — так получается Fe2(SO4)3.
Дальше остаётся умножить количество атомов на атомные массы из таблицы и сложить.
Ошибки обрабатываются текстом, а не «падением» приложения.
""")

# --- 13. Таблица Менделеева ---
s = content_slide('Таблица Менделеева: из данных в сетку', 'ДАННЫЕ → ВЁРСТКА · src/pages/PeriodicTable.jsx', 13, bullets=[
    'Таблица строится циклом из массива элементов: чтобы добавить элемент, достаточно дописать строку в data/elements.js.',
    'Место клетки определяется полями period и group, а лантаноиды и актиноиды выведены отдельными рядами, как в учебнике.',
    'CSS Grid из 18 колонок держит все клетки одинаковыми, а размер в em позволяет масштабировать таблицу целиком.',
    'Нажатие на клетку открывает карточку элемента: масса, конфигурация, степени окисления, год открытия.',
], code="""
const CELL = 4.2                        // размер клетки в em (масштабируется)
const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1)

<div className="grid" style={{ gridTemplateColumns: `repeat(18, ${CELL}em)`, gap: '0.4em' }}>
  {[1, 2, 3, 4, 5, 6, 7].map((p) => gridRow(p))}    {/* 7 периодов */}
</div>

// клетка: позиция — из period и group, цвет — из категории элемента
<button style={{ background: CATEGORIES[el.cat].color }} onClick={() => setSelected(el)}>
  <span>{el.z}</span> <span>{el.sym}</span> <span>{el.mass}</span>
</button>
""", caption='src/pages/PeriodicTable.jsx (сокращённо)', bullet_size=13, code_size=11)
notes(s, """
Таблица Менделеева — пример того, как данные превращаются в интерфейс.
Я не расставлял 118 клеток руками: таблица строится циклом по массиву элементов, а положение
клетки определяется периодом и группой. CSS Grid из восемнадцати колонок сам выравнивает
клетки, поэтому все они одинаковые.
Категория элемента — щелочные металлы, галогены, инертные газы — задаёт цвет клетки,
это связь данных и оформления.
При нажатии на клетку открывается карточка элемента. Есть и поиск по названию, символу или
номеру: подходящие элементы подсвечиваются, остальные затемняются.
Размер клетки задан в em, поэтому вся таблица масштабируется одной переменной — об этом я
расскажу на слайде про масштаб.
""")

# --- 14. Дневник ---
s = content_slide('Дневник опытов: хранение данных на устройстве', 'СОСТОЯНИЕ + localStorage · src/lib/storage.js', 14, bullets=[
    'Дневник живёт в localStorage — встроенном хранилище браузера: данные не уходят на сервер и доступны без интернета.',
    'В ключе есть версия (-v1): если структура записи изменится, можно перейти на новый формат, не теряя старые данные.',
    'normalizeExperiment достраивает пропущенные поля, поэтому записи из прошлой версии приложения продолжают работать.',
    'Чтение обёрнуто в try/catch: если данные повреждены, приложение вернёт пустой список вместо ошибки на экране.',
], code="""
const KEY = 'chemlab-experiments-v1'

export function loadExperiments() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(list) ? list.map(normalizeExperiment) : []
  } catch {
    return []                  // повреждённые данные не ломают приложение
  }
}

export function saveExperiments(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function uid() {        // уникальный id записи или шага
  return crypto.randomUUID?.() ?? `${Date.now()}-...`
}
""", caption='src/lib/storage.js — сохранение и чтение дневника', bullet_size=13, code_size=11)
notes(s, """
Дневник опытов — единственное место, где пользователь сам создаёт данные.
Я храню их в localStorage, встроенном хранилище браузера. Оно подходит по трём причинам:
не нужен сервер и регистрация, данные доступны офлайн и остаются на устройстве ученика.
В ключе хранилища указана версия — это запас на будущее: если структура записи изменится,
я смогу отличить старый формат от нового.
Функция normalizeExperiment достраивает отсутствующие поля: если запись создана в более старой
версии приложения, при чтении она всё равно будет корректной.
Чтение и запись обёрнуты в try/catch, чтобы повреждённые данные не ломали приложение.
Каждая запись и каждый шаг получают уникальный идентификатор — можно редактировать
и удалять их по отдельности.
""")

# --- 15. Темы ---
slide = prs.slides.add_slide(BLANK)
header(slide, 'Темы оформления: тёмная и AMOLED', 'КОНТЕКСТ + CSS-ПЕРЕМЕННЫЕ', 15)
draw_code(slide, """
// src/lib/ThemeProvider.jsx — тема вешается атрибутом на <html>
useEffect(() => {
  document.documentElement.dataset.theme = theme          // <html data-theme="amoled">
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])        // цвет строки браузера
  localStorage.setItem('chemlab-theme-v1', theme)         // выбор запоминается
}, [theme])
""", 1.5, 11.5, 'src/lib/ThemeProvider.jsx')
draw_code(slide, """
/* src/index.css */
:root                      { --page: #0f1219; }   /* тёмно-синий фон  */
:root[data-theme='amoled'] { --page: #000000; }   /* чистый чёрный    */

.app-bg { background-color: var(--page); }
""", 3.35, 11.5, 'Темы как набор CSS-переменных')
draw_bullets(slide, [
    'Тема — это атрибут data-theme у <html>, а цвета — CSS-переменные: при переключении не нужно перерисовывать компоненты.',
    'AMOLED-тема убирает фон-градиент и делает панели прозрачнее: на OLED-экранах меньше свечения и расход батареи.',
    'Выбор сохраняется в localStorage и применяется при следующем запуске; цвет строки состояния тоже обновляется.',
    'Любой экран получает тему через хук useTheme(), без «протаскивания» настроек через все компоненты.',
], 5.05, 12.5)
notes(slide, """
Про темы. В приложении две темы: обычная тёмная и AMOLED — полностью чёрная.
Сделано так: провайдер темы вешает на корневой элемент html атрибут data-theme, а все цвета
в стилях — это CSS-переменные. Меняется одна переменная — меняется всё приложение.
Такой подход быстрее и проще, чем хранить цвета в каждом компоненте.
Отдельно обновляется метатег theme-color — он отвечает за цвет строки состояния в браузере.
AMOLED-тема убирает фон-градиент и делает полупрозрачные панели прозрачнее: на OLED-экранах
чёрный пиксель не светится, поэтому расход батареи меньше.
Любой экран может узнать текущую тему через хук useTheme — не нужно передавать её через
все компоненты.
""")

# --- 16. Масштаб ---
s = content_slide('Масштаб больших таблиц', 'ПРОБЛЕМА → РЕШЕНИЕ · src/lib/useZoom.js', 16, bullets=[
    'Идея: размеры клеток заданы в em, а масштаб — это размер шрифта их контейнера. Одна переменная увеличивает всю таблицу.',
    'Сначала я попробовал CSS-свойство zoom, но оно «съезжало» с закреплённых заголовков при прокрутке — поэтому отказался.',
    'Кнопка ⤢ умещает таблицу по ширине экрана: нужный масштаб считается из ширины контейнера через ResizeObserver.',
    'Выбранный масштаб сохраняется в localStorage — при следующем открытии таблица выглядит так же.',
], code="""
const UNIT = 10                                  // базовый размер шрифта, px
const { zoom, zoomIn, zoomOut, reset, setZoom } = useZoom({
  min: 0.4, max: 1.8, step: 0.1,
  storageKey: 'chemlab-zoom-table',              // масштаб запоминается
})

<div style={{ fontSize: `${zoom * UNIT}px` }}>   {/* масштаб задаётся контейнеру */}
  <div style={{ gridTemplateColumns: `repeat(18, 4.2em)`, gap: '0.4em' }}>
    {/* все размеры клеток — в em: растут вместе со шрифтом контейнера */}
  </div>
</div>
""", caption='src/lib/useZoom.js + src/pages/PeriodicTable.jsx', bullet_size=13, code_size=11)
notes(s, """
Таблица Менделеева и таблица растворимости не помещаются на экран телефона целиком,
поэтому я сделал масштабирование.
Решение простое: все размеры внутри таблицы заданы в em, то есть относительно размера шрифта.
Масштаб — это просто изменение размера шрифта у контейнера. Одна цифра увеличивает и клетки,
и подписи, и расстояния между ними — таблица не «разъезжается».
Изначально я пробовал CSS-свойство zoom, которое меняет масштаб блока. Но у меня есть
закреплённые заголовки строк и столбцов при прокрутке, и они смещались. Поэтому я перешёл
на шрифт и em — это работает одинаково во всех браузерах.
Ещё есть кнопка «уместить по ширине»: я измеряю ширину контейнера через ResizeObserver
и вычисляю нужный масштаб. Выбор сохраняется, чтобы не подбирать его каждый раз.
""")

# --- 17. Сравнение версий ---
s = content_slide('Проверка обновлений при запуске', 'СЕТЬ + СРАВНЕНИЕ ВЕРСИЙ', 17, bullets=[
    'Версии сравниваю по числам, а не как строки: иначе «1.10» оказалось бы «меньше» «1.9» — классическая ошибка.',
    'Файл version.json генерируется при сборке: версия, номер сборки, список изменений и ссылка на новую сборку для Android.',
    'Параметр cache: "no-store" и метка времени в адресе не дают браузеру отдать старый файл из кэша.',
    'Если сети нет, ошибка перехватывается молча — приложение продолжает работать как обычно.',
], code="""
export function compareVersions(a, b) {          // '1.10.0' > '1.9.0'
  const x = a.split('.').map(Number), y = b.split('.').map(Number)
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0)
    if (d) return d > 0 ? 1 : -1
  }
  return 0
}

export async function checkForUpdate() {
  const res = await fetch(`${VERSION_PATH}?t=${Date.now()}`, { cache: 'no-store' })
  const remote = await res.json()                // version.json с сервера
  const cmp = compareVersions(remote.version, APP_VERSION)
  return { updateAvailable: cmp > 0, version: remote.version, notes: remote.notes }
}
""", caption='src/lib/updates.js', bullet_size=13, code_size=11)
notes(s, """
Здесь я сделал механизм, чтобы приложение само узнавало о новых версиях.
При сборке формируется файл version.json: номер версии, номер сборки и список изменений.
При запуске приложение его запрашивает и сравнивает со своей версией.
Сравнение — отдельная функция, и это не формальность. Если сравнивать версии как строки,
то «1.10» окажется меньше, чем «1.9», потому что символ «1» меньше символа «9». Поэтому версия
разбивается на числа и сравнивается по частям.
Ещё две детали: отключено кэширование, иначе браузер отдаст старый файл, и запрос обёрнут
в try/catch — если интернета нет, приложение просто продолжает работать без ошибок.
""")

# --- 18. Окно обновления ---
s = content_slide('Как показывается обновление', 'ИНТЕРФЕЙС ОБНОВЛЕНИЯ', 18, bullets=[
    'Проверка «тихая»: если обновлений нет, пользователь вообще ничего не видит — никаких лишних сообщений.',
    'Если версия новее — на главном экране появляется карточка «Доступно обновление» с тремя пунктами изменений и кнопками «Обновить» и «Позже».',
    'Одновременно можно открыть подробное окно со всем списком изменений и номером версии.',
    'В браузере «Обновить» активирует новый service worker и перезагружает страницу; в APK открывается загрузка новой сборки (установка поверх сохраняет дневник).',
], code="""
// UpdateProvider: тихая проверка через 1,2 с после запуска
useEffect(() => {
  const timer = setTimeout(() => runCheck({ silent: true }), 1200)
  return () => clearTimeout(timer)          // очистка таймера при закрытии
}, [runCheck])

// повторная проверка при возврате в приложение — не чаще раза в 30 минут
if (Date.now() - lastCheckRef.current < RECHECK_AFTER_MS) return

// «Позже» запоминает версию, чтобы окно не всплывало при каждом запуске
dismiss()  →  postponeVersion(current.version)
""", caption='src/lib/UpdateProvider.jsx (сокращённо)', bullet_size=13, code_size=11.5)
notes(s, """
Это интерфейсная часть обновлений.
Проверка запускается не сразу, а через секунду после старта, чтобы не тормозить первый показ
экрана. Если обновлений нет — пользователь ничего не видит, никаких окон и сообщений.
Иначе на главном экране появляется карточка: номер версии, краткий список изменений и кнопки.
Кнопка «Позже» запоминает версию, чтобы окно не всплывало при каждом запуске — это важно
для удобства.
Если пользователь нажимает «Обновить» в браузере, активируется новый service worker
и страница перезагружается. В Android-версии открывается загрузка нового файла, а установка
поверх старой сохраняет дневник, потому что данные лежат в хранилище приложения.
""")

# --- 19. Автоматизация ---
s = content_slide('Автоматическая сборка сайта и APK', 'CI/CD · .github/workflows', 19, bullets=[
    'Два сценария: deploy.yml публикует сайт на GitHub Pages, build-apk.yml собирает APK и выкладывает его в релизы.',
    'Один и тот же код собирается дважды: для сайта с базой «/chem-lab-tracker/», для Android — с относительными путями.',
    'Каждая сборка получает номер, а версия берётся из package.json — поэтому приложение знает свою версию и может сравнить её с сервером.',
    'Сборка APK идёт без Android Studio: всё делается на серверах GitHub Actions автоматически.',
], code="""
name: Build Android APK
on:
  push:
    branches: [main]
    tags: ['v*']                 # или вручную из вкладки Actions

jobs:
  apk:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4                 # JDK 21 для Android SDK
      - run: npm ci                                 # установка зависимостей
      - run: npm run build:apk-web                  # сборка веб-части (base './')
      - run: npx cap add android && npx cap sync    # перенос в нативный проект
      - run: ./gradlew assembleDebug                # сборка APK
      - uses: softprops/action-gh-release@v2        # публикация релиза
""", caption='.github/workflows/build-apk.yml (сокращённо)', bullet_size=13, code_size=11)
notes(s, """
Последняя техническая часть — сборка.
В проекте два автоматических сценария. Первый публикует сайт на GitHub Pages при каждом
обновлении основной ветки. Второй собирает APK для Android: ставит Java, устанавливает
зависимости, собирает веб-часть, переносит её в Android-проект через Capacitor и запускает
сборку Gradle. Готовый файл автоматически публикуется в разделе релизов.
Важная деталь — один и тот же код собирается двумя способами: для сайта нужны пути от корня,
а для Android — относительные, потому что приложение работает из локального файла.
И ещё: номер сборки подставляется в приложение, поэтому оно знает свою версию — именно это
позволяет сравнивать её с сервером и предлагать обновление.
""")

# --- 20. UX ---
s = content_slide('Мобильные детали и качество', 'МЕЛОЧИ, КОТОРЫЕ ВИДНЫ НА ТЕЛЕФОНЕ', 20, bullets=[
    'Отступы под системные элементы: env(safe-area-inset-*) — «чёлка» и полоса жестов на iPhone.',
    'Поля ввода размером 16px — иначе Safari сам приближает страницу при фокусе и «ломает» вёрстку.',
    'Крупные кнопки и нижнее меню — чтобы пользоваться приложением одной рукой.',
    'Пустые состояния: если записей нет или поиск ничего не нашёл, показывается подсказка, а не пустой экран.',
    'Проверка перед каждым коммитом: линтер oxlint, сборка проекта, проверка всех маршрутов.',
], code="""
/* src/index.css */
body            { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }
input, textarea { font-size: 16px; }     /* iPhone не приближает страницу при вводе */

.table-scroll {                          /* свои таблицы: плавный скролл и «липкие» заголовки */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}
""", caption='src/index.css', bullet_size=13, code_size=11.5)
notes(s, """
Отдельно я дорабатывал мелочи, которые заметны именно на телефоне.
Первое — безопасные отступы: на iPhone сверху «чёлка», снизу полоса жестов, поэтому я
использую переменные safe-area, чтобы меню и шапка не наезжали на системные элементы.
Второе — поля ввода размером 16 пикселей. Это не про красоту: в Safari на iPhone, если шрифт
меньше, браузер сам увеличивает страницу при фокусе, и вёрстка съезжает.
Третье — крупные элементы управления и меню, до которого достаёт большой палец.
Четвёртое — пустые состояния: если данных нет, пользователь видит подсказку, что делать.
И пятое — качество кода: подключён линтер, который находит забытые переменные и ошибки,
а перед сборкой я проверяю, что проект собирается и все экраны открываются.
""")

# --- 21. Итоги ---
s = content_slide('Итоги и чему я научился', 'РЕЗУЛЬТАТ РАБОТЫ', 21, bullets=[
    ('Результат: ', 'приложение из 9 экранов, которое работает и как сайт, и как приложение для Android.'),
    ('Данные: ', '118 элементов, 40 реакций, таблица растворимости 24 × 18, справочные ряды и схемы.'),
    ('Офлайн и данные: ', 'после первого открытия приложение работает без интернета; записи хранятся на устройстве.'),
    ('На практике отработал: ', 'компоненты и хуки React, контекст для общих данных, разбор строк (парсер формул), CSS Grid, PWA и service worker, сборку APK через CI.'),
    ('Главный вывод: ', 'сложнее всего не вёрстка, а продумывание связей — где хранить данные, как их передать и как обновлять без потери пользовательских записей.'),
], code="""
Планы развития:
  · экспорт дневника в PDF/таблицу и печать отчёта об опыте
  · собственные реакции пользователя и избранные элементы
  · версия для планшета с двумя колонками
""", caption='Что можно сделать дальше', bullet_size=13.5, code_size=12)
notes(s, """
Подведу итог.
Получилось приложение из девяти экранов, которое работает и в браузере, и как обычное
приложение на Android. Внутри сорок реакций, полная таблица Менделеева, таблица
растворимости и справочные материалы, а дневник опытов хранится на устройстве.
Для меня главный вывод: самая сложная часть — не вёрстка, а связи. Где хранить данные, как
передать их на экран, как сделать так, чтобы записи пользователя не потерялись при обновлении
приложения. Именно над этим я думал больше всего.
В планах — экспорт дневника в PDF, свои реакции и версия для планшета.
""")

# --- 22. Финал ---
s = prs.slides.add_slide(BLANK)
add_box(s, 0, 0, SLIDE_W, SLIDE_H, fill=RGBColor(0x14, 0x0B, 0x2A))
add_box(s, 0, 0, Inches(0.35), SLIDE_H, fill=VIOLET)
add_text(s, 1.2, 2.4, 10, 1.1, 'Спасибо за внимание!', size=42, color=WHITE, bold=True)
add_box(s, Inches(1.23), Inches(3.5), Inches(2.2), Pt(3), fill=CYAN)
add_text(s, 1.2, 3.85, 10, 1.4,
         [[('Готов ответить на вопросы по коду, данным и сборке.', {'color': LIGHT})],
          [('Проект доступен онлайн: сайт приложения и APK для Android.', {'color': LIGHT})]],
         size=16, spacing=1.4)
notes(s, """
Спасибо за внимание, готов ответить на вопросы.
Если спросят про самое трудное — скажу про парсер формул и про совместимость версий.
Если спросят про дальнейшее развитие — экспорт дневника и свои реакции.
""")

prs.save(OUT)
print('готово:', OUT)


# ------------------------- итоговая проверка -------------------------
prs2 = Presentation(OUT)
problems = []
for idx, slide in enumerate(prs2.slides, 1):
    for sh in slide.shapes:
        if not sh.has_text_frame or not sh.text_frame.text.strip():
            continue
        bottom = (sh.top + sh.height) / 914400.0
        if bottom > 7.45:
            problems.append((idx, sh.text_frame.text[:40].replace('\n', ' '), round(bottom, 2)))
print('слайдов:', len(prs2.slides))
print('блоков за границей слайда:', problems if problems else 'нет')

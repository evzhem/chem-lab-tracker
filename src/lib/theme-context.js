import { createContext, useContext } from 'react'

const KEY = 'chemlab-theme-v1'

export const THEMES = [
  {
    id: 'dark',
    label: 'Тёмная',
    hint: 'Мягкий тёмно-синий фон',
    swatch: ['#0f1219', '#1b2030', '#8b5cf6'],
  },
  {
    id: 'amoled',
    label: 'AMOLED',
    hint: 'Чистый чёрный, экономит заряд',
    swatch: ['#000000', '#0b0b0f', '#8b5cf6'],
  },
]

export const THEME_COLORS = {
  dark: '#0f1219',
  amoled: '#000000',
}

export const ThemeContext = createContext(null)

export function readStoredTheme() {
  try {
    const stored = localStorage.getItem(KEY)
    return stored === 'amoled' ? 'amoled' : 'dark'
  } catch {
    return 'dark'
  }
}

export function persistTheme(theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* приватный режим — тема просто не сохранится */
  }
}

export function useTheme() {
  return (
    useContext(ThemeContext) ?? {
      theme: 'dark',
      setTheme: () => {},
      isAmoled: false,
    }
  )
}

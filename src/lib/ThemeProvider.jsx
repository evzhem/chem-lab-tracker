import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  THEME_COLORS,
  ThemeContext,
  persistTheme,
  readStoredTheme,
} from './theme-context.js'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = 'dark'

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark)

    persistTheme(theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next === 'amoled' ? 'amoled' : 'dark')
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, isAmoled: theme === 'amoled' }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

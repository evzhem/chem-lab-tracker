import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Масштаб таблиц (Менделеев, растворимость).
 * Значение сохраняется в localStorage, если передан storageKey.
 */
export function useZoom({ min = 0.5, max = 1.8, step = 0.1, initial = 1, storageKey } = {}) {
  const clamp = useCallback(
    (v) => Math.min(max, Math.max(min, Math.round(v * 100) / 100)),
    [min, max],
  )

  const [zoom, setZoomState] = useState(() => {
    if (!storageKey) return initial
    try {
      const stored = Number(localStorage.getItem(storageKey))
      return Number.isFinite(stored) && stored > 0 ? clamp(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, String(zoom))
    } catch {
      /* приватный режим — масштаб просто не сохранится */
    }
  }, [storageKey, zoom])

  const setZoom = useCallback((v) => setZoomState(clamp(v)), [clamp])
  const zoomIn = useCallback(() => setZoomState((z) => clamp(z + step)), [clamp, step])
  const zoomOut = useCallback(() => setZoomState((z) => clamp(z - step)), [clamp, step])
  const reset = useCallback(() => setZoomState(clamp(initial)), [clamp, initial])

  return useMemo(
    () => ({
      zoom,
      setZoom,
      zoomIn,
      zoomOut,
      reset,
      min,
      max,
      step,
      canZoomIn: zoom < max - 0.001,
      canZoomOut: zoom > min + 0.001,
    }),
    [zoom, setZoom, zoomIn, zoomOut, reset, min, max, step],
  )
}

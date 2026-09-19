import { Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'

export default function ZoomControls({
  zoom,
  zoomIn,
  zoomOut,
  reset,
  canZoomIn = true,
  canZoomOut = true,
  fitZoom,
  onFit,
  className = '',
}) {
  const btn =
    'flex h-9 w-9 items-center justify-center rounded-full text-violet-100 transition-colors active:scale-95 disabled:opacity-30 disabled:active:scale-100'
  const fitActive = fitZoom != null && Math.abs(fitZoom - zoom) < 0.01

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5 ${className}`}
    >
      <button
        type="button"
        onClick={zoomOut}
        disabled={!canZoomOut}
        className={btn}
        aria-label="Уменьшить масштаб"
        title="Уменьшить"
      >
        <Minus size={16} />
      </button>
      <span className="w-11 text-center text-xs font-medium tabular-nums text-violet-200">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={zoomIn}
        disabled={!canZoomIn}
        className={btn}
        aria-label="Увеличить масштаб"
        title="Увеличить"
      >
        <Plus size={16} />
      </button>
      {onFit && (
        <button
          type="button"
          onClick={onFit}
          className={`${btn} ${fitActive ? 'bg-violet-500/30 text-white' : ''}`}
          aria-label="Уместить по ширине"
          title="Уместить по ширине"
        >
          <Maximize2 size={15} />
        </button>
      )}
      <button
        type="button"
        onClick={reset}
        className={btn}
        aria-label="Сбросить масштаб"
        title="Сбросить"
      >
        <RotateCcw size={15} />
      </button>
    </div>
  )
}

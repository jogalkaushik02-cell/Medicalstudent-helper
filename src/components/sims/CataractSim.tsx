import { useId, useState } from 'react'
import { Info } from 'lucide-react'

function Scene({ severity, blurred, label }: { severity: number; blurred: boolean; label: string }) {
  const uid = useId().replace(/:/g, '')
  const skyId = `${uid}-sky`
  const groundId = `${uid}-ground`
  const glowId = `${uid}-glow`
  const blurPx = blurred ? severity * 0.055 : 0
  const yellow = blurred ? severity * 0.0035 : 0
  const glare = blurred ? Math.max(0, (severity - 45) / 55) : 0

  return (
    <div className="cataract-panel">
      <div className="field-label">{label}</div>
      <svg viewBox="0 0 300 210" className="cataract-svg" role="img" aria-label={label}>
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fd3ff" />
            <stop offset="62%" stopColor="#d8efff" />
            <stop offset="100%" stopColor="#f7f1dd" />
          </linearGradient>
          <linearGradient id={groundId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6fae62" />
            <stop offset="100%" stopColor="#3f7c46" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8d8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fff8d8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={300} height={210} fill={`url(#${skyId})`} />

        <g style={{ filter: blurPx > 0 ? `blur(${blurPx}px) saturate(${Math.max(0.35, 1 - severity * 0.004)})` : undefined }}>
          <circle cx={234} cy={48} r={26} fill="#ffe89a" />
          <circle cx={234} cy={48} r={38} fill="#ffe89a" opacity={0.18} />

          <path d="M 0 128 C 42 96 82 108 120 122 C 158 136 186 104 226 112 C 258 118 278 128 300 120 L 300 210 L 0 210 Z" fill="#8fc7a4" opacity={0.7} />
          <path d="M 0 148 C 48 128 92 140 138 148 C 188 157 222 138 268 144 C 284 146 294 150 300 148 L 300 210 L 0 210 Z" fill={`url(#${groundId})`} />

          <rect x={52} y={124} width={62} height={52} fill="#f3e2c0" />
          <path d="M 44 124 L 83 94 L 122 124 Z" fill="#b6503c" />
          <rect x={72} y={146} width={16} height={30} fill="#6f4a35" />
          <rect x={96} y={136} width={12} height={12} fill="#8fd3ff" stroke="#6f4a35" strokeWidth={1.5} />

          <rect x={134} y={74} width={4} height={72} fill="#6b4c32" />
          <circle cx={136} cy={68} r={24} fill="#4d8f4d" />
          <circle cx={120} cy={78} r={16} fill="#5ca15a" />
          <circle cx={152} cy={80} r={14} fill="#5ca15a" />

          <rect x={196} y={122} width={58} height={36} rx={3} fill="#fdf7e8" stroke="#8c7a5d" strokeWidth={2} />
          <text x={225} y={140} textAnchor="middle" fill="#2c3742" fontSize={13} fontWeight={700} letterSpacing="1">
            E F P
          </text>
          <text x={225} y={153} textAnchor="middle" fill="#2c3742" fontSize={9} letterSpacing="1">
            T O Z
          </text>

          <path d="M 0 184 C 60 174 120 188 180 180 C 230 174 268 184 300 178" fill="none" stroke="#2f6638" strokeWidth={2} opacity={0.5} />
        </g>

        {blurred && severity > 0 && (
          <>
            <rect width={300} height={210} fill="#b8862f" opacity={yellow} style={{ mixBlendMode: 'multiply' }} />
            <circle cx={234} cy={48} r={70} fill={`url(#${glowId})`} opacity={glare * 0.55} />
            <circle cx={150} cy={105} r={120} fill="#fff4cf" opacity={severity * 0.0012} />
          </>
        )}
      </svg>
    </div>
  )
}

export default function CataractSim() {
  const [severity, setSeverity] = useState(65)

  return (
    <div>
      <div className="cataract-grid">
        <Scene severity={0} blurred={false} label="Normal vision" />
        <Scene severity={severity} blurred label={`Cataract · ${severity}% opacity`} />
      </div>

      <div className="cataract-controls">
        <div style={{ flex: 1 }}>
          <div className="control-row">
            <span className="control-label">Lens opacity</span>
            <span className="mono small" style={{ color: 'var(--teal-2)' }}>
              {severity}%
            </span>
          </div>
          <input
            className="range"
            type="range"
            min={0}
            max={100}
            step={5}
            value={severity}
            onChange={(event) => setSeverity(Number(event.target.value))}
            aria-label="Cataract severity"
          />
        </div>
        <div className="sim-note" style={{ marginTop: 0, flex: 1.4 }}>
          <strong>What changes.</strong> Nuclear sclerosis yellows and stiffens the lens; cortical
          spokes and posterior subcapsular plaque scatter light. Patients notice glare, halos, faded
          contrast and slowly blurring vision. Surgery is considered when vision affects daily life.
        </div>
      </div>

      <div className="row small dim" style={{ gap: 6, marginTop: 10 }}>
        <Info size={11} />
        <span>Simulated view, not a prediction of an individual patient’s vision.</span>
      </div>
    </div>
  )
}

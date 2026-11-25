import { useState } from 'react'
import { Activity, TriangleAlert, Volume2, Wind } from 'lucide-react'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const PRESETS = [
  { label: 'Normal', value: 100 },
  { label: 'Laryngitis', value: 72 },
  { label: 'Croup', value: 46 },
  { label: 'Bilateral palsy', value: 26 },
  { label: 'Critical', value: 10 },
]

function severityFor(calibre: number) {
  if (calibre >= 80) return { label: 'Normal', tone: 'ok', stridor: 'None', voice: 'Normal' }
  if (calibre >= 60) return { label: 'Mild', tone: 'warn', stridor: 'With exertion', voice: 'Hoarse' }
  if (calibre >= 40) return { label: 'Moderate', tone: 'warn', stridor: 'At rest', voice: 'Breathy' }
  return { label: 'Severe', tone: 'danger', stridor: 'Marked at rest', voice: 'Weak or absent' }
}

export default function AirwaySim() {
  const [calibre, setCalibre] = useState(100)
  const severity = severityFor(calibre)
  const gap = 4 + (calibre / 100) * 34
  const leftX = 160 - gap / 2 - 26
  const rightX = 160 + gap / 2
  const airflow = calibre / 100

  return (
    <div className="airway-sim">
      <div className="airway-stage">
        <svg viewBox="0 0 320 300" className="airway-svg" role="img" aria-label={`Larynx cross-section with ${calibre}% airway calibre`}>
          <defs>
            <linearGradient id="airway-tissue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="airway-flow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" stopOpacity={0.15 + airflow * 0.55} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1 + airflow * 0.35} />
            </linearGradient>
          </defs>

          <path
            d="M92 44 C64 70 58 118 72 170 C84 214 116 238 160 242 C204 238 236 214 248 170 C262 118 256 70 228 44 Z"
            fill="rgba(139,92,246,0.08)"
            stroke="rgba(167,139,250,0.55)"
            strokeWidth="2"
          />
          <path d="M124 70 C108 96 106 132 116 168" fill="none" stroke="rgba(94,234,212,0.3)" strokeWidth="1.5" strokeDasharray="4 5" />
          <path d="M196 70 C212 96 214 132 204 168" fill="none" stroke="rgba(94,234,212,0.3)" strokeWidth="1.5" strokeDasharray="4 5" />

          <rect x={leftX} y="78" width="26" height="112" rx="13" fill="url(#airway-tissue)" />
          <rect x={rightX} y="78" width="26" height="112" rx="13" fill="url(#airway-tissue)" />
          <rect x={leftX + 26} y="96" width={gap / 2} height="76" fill="url(#airway-flow)" />
          <rect x={rightX - gap / 2} y="96" width={gap / 2} height="76" fill="url(#airway-flow)" />

          {calibre < 40 && (
            <g opacity={0.9}>
              <path d="M154 190 L166 190 L160 202 Z" fill="#fb7185" />
              <circle cx="160" cy="212" r="3" fill="#fb7185" />
            </g>
          )}

          <path d="M132 242 L132 282 M188 242 L188 282" stroke="rgba(167,139,250,0.45)" strokeWidth="2" />
          <path d="M132 254 L188 254 M132 268 L188 268" stroke="rgba(94,234,212,0.25)" strokeWidth="2" />
          <text x="160" y="28" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="monospace">
            GLOTTIS · {calibre}% CALIBRE
          </text>
          <text x="160" y="296" textAnchor="middle" fill="#6f6896" fontSize="9" fontFamily="monospace">
            TRACHEA
          </text>
        </svg>
        <div className="airway-scale">
          <span>Open</span>
          <span>Narrowed</span>
        </div>
      </div>

      <div className="airway-controls">
        <label className="slider-control">
          <span>
            <span>
              <Wind size={12} style={{ marginRight: 5, verticalAlign: -2 }} />
              Airway calibre
            </span>
            <span className="mono">{calibre}%</span>
          </span>
          <input
            className="range"
            type="range"
            min={10}
            max={100}
            step={1}
            value={calibre}
            onChange={(event) => setCalibre(clamp(Number(event.target.value), 10, 100))}
            aria-label="Airway calibre percentage"
          />
        </label>

        <div className="airway-presets" role="group" aria-label="Airway presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`filter-btn${calibre === preset.value ? ' active' : ''}`}
              onClick={() => setCalibre(preset.value)}
              aria-pressed={calibre === preset.value}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="sim-readout">
          <div className="readout">
            <span>Severity</span>
            <strong className={`tone-${severity.tone}`}>{severity.label}</strong>
          </div>
          <div className="readout">
            <span>
              <Activity size={9} style={{ marginRight: 3, verticalAlign: -1 }} />
              Stridor
            </span>
            <strong>{severity.stridor}</strong>
          </div>
          <div className="readout">
            <span>
              <Volume2 size={9} style={{ marginRight: 3, verticalAlign: -1 }} />
              Voice
            </span>
            <strong>{severity.voice}</strong>
          </div>
        </div>

        <div className={`airway-note${calibre < 40 ? ' danger' : ''}`} aria-live="polite">
          {calibre >= 80 && 'Airflow is quiet. The airway is protected and voice is normal.'}
          {calibre >= 60 && calibre < 80 && 'Mild narrowing: hoarseness and exertional stridor. Voice rest and treat the cause.'}
          {calibre >= 40 && calibre < 60 && 'Moderate narrowing: inspiratory stridor at rest. This is a monitored airway.'}
          {calibre < 40 && (
            <>
              <TriangleAlert size={12} style={{ marginRight: 5, verticalAlign: -2 }} />
              Severe narrowing: marked stridor, retractions and distress. Treat as an airway emergency.
            </>
          )}
        </div>

        <p className="airway-footnote">
          Schematic teaching model. Real airway assessment uses work of breathing, air entry, oxygen
          saturation and the trend over time — not a single number.
        </p>
      </div>
    </div>
  )
}

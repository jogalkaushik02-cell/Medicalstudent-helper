import { useMemo, useState } from 'react'
import { Ear, Info } from 'lucide-react'

const FREQS = [250, 500, 1000, 2000, 4000, 8000]
const SHAPE = [0.62, 0.82, 1, 1.06, 1.2, 1.34]

type Pattern = 'normal' | 'conductive' | 'sensorineural' | 'mixed'
type Side = 'right' | 'left'

const PATTERNS: { id: Pattern; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'conductive', label: 'Conductive' },
  { id: 'sensorineural', label: 'Sensorineural' },
  { id: 'mixed', label: 'Mixed' },
]

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

function buildCurves(pattern: Pattern, severity: number) {
  return FREQS.map((_, index) => {
    const shape = SHAPE[index]
    if (pattern === 'normal') return { ac: 0, bc: 0 }
    if (pattern === 'conductive') {
      return { ac: clamp(severity * shape), bc: clamp(severity * 0.1) }
    }
    if (pattern === 'sensorineural') {
      const value = clamp(severity * shape)
      return { ac: value, bc: value }
    }
    const bc = clamp(severity * 0.55 * shape)
    return { ac: clamp(bc + Math.max(18, severity * 0.3)), bc }
  })
}

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

function severityLabel(pta: number) {
  if (pta <= 20) return 'Normal'
  if (pta <= 40) return 'Mild'
  if (pta <= 55) return 'Moderate'
  if (pta <= 70) return 'Moderately severe'
  if (pta <= 90) return 'Severe'
  return 'Profound'
}

export default function AudiogramSim() {
  const [pattern, setPattern] = useState<Pattern>('sensorineural')
  const [severity, setSeverity] = useState(45)
  const [side, setSide] = useState<Side>('right')

  const values = useMemo(() => buildCurves(pattern, severity), [pattern, severity])
  const pta = Math.round(average([values[1].ac, values[2].ac, values[3].ac, values[4].ac]))
  const abg = Math.round(average([values[1].ac - values[1].bc, values[2].ac - values[2].bc, values[3].ac - values[3].bc]))
  const bcAvg = Math.round(average([values[1].bc, values[2].bc, values[3].bc, values[4].bc]))

  const type =
    pta <= 20 && abg < 10
      ? 'Normal hearing'
      : abg >= 10 && bcAvg <= 20
        ? 'Conductive hearing loss'
        : abg >= 10
          ? 'Mixed hearing loss'
          : 'Sensorineural hearing loss'

  const tuning =
    pattern === 'normal'
      ? 'Rinne positive bilaterally · Weber midline'
      : pattern === 'conductive'
        ? 'Rinne negative in the affected ear · Weber lateralises to the affected ear'
        : pattern === 'sensorineural'
          ? 'Rinne positive (both reduced) · Weber lateralises to the better ear'
          : 'Rinne negative if the conductive gap dominates · Weber variable'

  const color = side === 'right' ? '#fb7185' : '#60a5fa'
  const width = 560
  const height = 318
  const left = 56
  const top = 24
  const plotW = 490
  const plotH = 236
  const bottom = top + plotH

  const x = (index: number) => left + index * (plotW / (FREQS.length - 1))
  const y = (db: number) => top + (db / 100) * plotH

  const acLine = values.map((value, index) => `${x(index)},${y(value.ac)}`).join(' ')
  const bcLine = values.map((value, index) => `${x(index)},${y(value.bc)}`).join(' ')

  const acSymbol = (cx: number, cy: number) =>
    side === 'right' ? (
      <circle cx={cx} cy={cy} r={5.4} fill="#0b121c" stroke={color} strokeWidth={2.2} />
    ) : (
      <path
        d={`M ${cx - 5} ${cy - 5} L ${cx + 5} ${cy + 5} M ${cx + 5} ${cy - 5} L ${cx - 5} ${cy + 5}`}
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    )

  const bcSymbol = (cx: number, cy: number) =>
    side === 'right' ? (
      <path
        d={`M ${cx + 6} ${cy - 6} L ${cx - 2} ${cy} L ${cx + 6} ${cy + 6}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d={`M ${cx - 6} ${cy - 6} L ${cx + 2} ${cy} L ${cx - 6} ${cy + 6}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )

  return (
    <div className="sim-grid">
      <div className="audiogram-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="audiogram-svg"
          role="img"
          aria-label={`Audiogram: ${type}, ${severityLabel(pta).toLowerCase()} ${side} ear`}
        >
          <rect x={left} y={top} width={plotW} height={plotH} fill="rgba(255,255,255,0.015)" stroke="var(--line)" />
          <rect x={left} y={y(0)} width={plotW} height={y(20) - y(0)} fill="rgba(45,212,191,0.05)" />

          {Array.from({ length: 11 }).map((_, index) => {
            const db = index * 10
            return (
              <g key={db}>
                <line
                  x1={left}
                  y1={y(db)}
                  x2={left + plotW}
                  y2={y(db)}
                  stroke={db % 20 === 0 ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.055)'}
                  strokeWidth={db % 20 === 0 ? 1 : 0.6}
                />
                {db % 20 === 0 && (
                  <text x={left - 8} y={y(db) + 3.5} textAnchor="end" fill="var(--dim)" fontSize={9}>
                    {db}
                  </text>
                )}
              </g>
            )
          })}

          {FREQS.map((freq, index) => (
            <g key={freq}>
              <line
                x1={x(index)}
                y1={top}
                x2={x(index)}
                y2={bottom}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.8}
              />
              <text x={x(index)} y={bottom + 17} textAnchor="middle" fill="var(--muted)" fontSize={9.5}>
                {freq}
              </text>
            </g>
          ))}

          <text x={left - 38} y={top + plotH / 2} transform={`rotate(-90 ${left - 38} ${top + plotH / 2})`} textAnchor="middle" fill="var(--dim)" fontSize={9}>
            Hearing level (dB HL)
          </text>
          <text x={left + plotW / 2} y={bottom + 35} textAnchor="middle" fill="var(--dim)" fontSize={9}>
            Frequency (Hz)
          </text>
          <text x={left + 6} y={y(14)} fill="var(--teal)" fontSize={8} opacity={0.75}>
            normal
          </text>

          <polyline points={bcLine} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.8} />
          <polyline points={acLine} fill="none" stroke={color} strokeWidth={1.8} opacity={0.9} />

          {values.map((value, index) => (
            <g key={`bc-${FREQS[index]}`}>
              {bcSymbol(x(index), y(value.bc))}
            </g>
          ))}
          {values.map((value, index) => (
            <g key={`ac-${FREQS[index]}`}>{acSymbol(x(index), y(value.ac))}</g>
          ))}

          <text x={left + plotW - 2} y={top + 12} textAnchor="end" fill={color} fontSize={9} fontWeight={600}>
            {side === 'right' ? 'Right ear (red)' : 'Left ear (blue)'}
          </text>
        </svg>

        <div className="sim-legend">
          <span>
            <span className="sim-symbol" style={{ borderColor: color }}>
              {side === 'right' ? '○' : '×'}
            </span>
            Air conduction
          </span>
          <span>
            <span className="sim-symbol" style={{ borderColor: color }}>
              {side === 'right' ? '‹' : '›'}
            </span>
            Bone conduction
          </span>
          <span className="dim">Solid = AC · dashed = BC</span>
        </div>
      </div>

      <div className="sim-controls">
        <div>
          <div className="control-label" style={{ marginBottom: 5 }}>
            Pattern
          </div>
          <div className="seg seg-wrap" role="group" aria-label="Hearing loss pattern">
            {PATTERNS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`seg-btn${pattern === item.id ? ' active' : ''}`}
                onClick={() => setPattern(item.id)}
                aria-pressed={pattern === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="control-row">
            <span className="control-label">Severity</span>
            <span className="mono small" style={{ color }}>
              {severity} dB
            </span>
          </div>
          <input
            className="range"
            type="range"
            min={0}
            max={85}
            step={5}
            value={severity}
            onChange={(event) => setSeverity(Number(event.target.value))}
            aria-label="Hearing loss severity in decibels"
          />
        </div>

        <div>
          <div className="control-label" style={{ marginBottom: 5 }}>
            Ear
          </div>
          <div className="seg" role="group" aria-label="Ear">
            <button type="button" className={`seg-btn${side === 'right' ? ' active' : ''}`} onClick={() => setSide('right')} aria-pressed={side === 'right'}>
              Right
            </button>
            <button type="button" className={`seg-btn${side === 'left' ? ' active' : ''}`} onClick={() => setSide('left')} aria-pressed={side === 'left'}>
              Left
            </button>
          </div>
        </div>

        <div className="sim-readout">
          <div className="readout">
            <span>PTA</span>
            <strong>{pta} dB</strong>
          </div>
          <div className="readout">
            <span>Air–bone gap</span>
            <strong>{abg} dB</strong>
          </div>
          <div className="readout">
            <span>Grade</span>
            <strong>{severityLabel(pta)}</strong>
          </div>
        </div>

        <div className="sim-note">
          <strong>{type}</strong>
          <div style={{ marginTop: 4 }}>{tuning}</div>
          <div style={{ marginTop: 5, color: 'var(--dim)' }}>
            Teaching schematic: bone conduction is shown unmasked; real audiometry includes masking
            and calibration.
          </div>
        </div>

        <div className="row small dim" style={{ gap: 6 }}>
          <Info size={11} />
          <span>PTA uses 500, 1000, 2000 and 4000 Hz.</span>
        </div>
      </div>
    </div>
  )
}

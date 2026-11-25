import { useId, useState } from 'react'
import { Info } from 'lucide-react'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function GlaucomaSim() {
  const [cdr, setCdr] = useState(0.6)
  const [iop, setIop] = useState(22)
  const uid = useId().replace(/:/g, '')
  const clipId = `${uid}-field-clip`
  const bgId = `${uid}-fundus`
  const cupId = `${uid}-cup`

  const discR = 42
  const cupR = discR * cdr
  const rimThickness = discR - cupR
  const defect = clamp((cdr - 0.4) / 0.5, 0, 1)
  const rimColor = cdr >= 0.75 ? '#f6dfc4' : cdr >= 0.55 ? '#f3b79d' : '#ef9a83'
  const risk = iop >= 30 || cdr >= 0.8 ? 'High' : iop >= 22 || cdr >= 0.6 ? 'Suspicious' : 'Lower'
  const riskTone = risk === 'High' ? 'danger' : risk === 'Suspicious' ? 'warn' : 'ok'
  const iopPercent = ((iop - 10) / 30) * 100

  return (
    <div className="sim-grid">
      <div className="fundus-wrap">
        <div className="fundus-flex">
          <svg viewBox="0 0 300 300" className="fundus-svg" role="img" aria-label={`Schematic fundus with cup-to-disc ratio ${cdr.toFixed(2)}`}>
            <defs>
              <radialGradient id={bgId} cx="42%" cy="38%" r="72%">
                <stop offset="0%" stopColor="#f6b26b" />
                <stop offset="58%" stopColor="#dc7f4e" />
                <stop offset="100%" stopColor="#a84532" />
              </radialGradient>
              <radialGradient id={cupId} cx="45%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#fffaf0" />
                <stop offset="100%" stopColor="#ead6b8" />
              </radialGradient>
            </defs>

            <circle cx={150} cy={150} r={144} fill="url(#bgId)" />
            <circle cx={150} cy={150} r={144} fill="none" stroke="rgba(30,10,8,0.35)" strokeWidth={3} />

            {[
              'M 190 145 C 150 120 108 100 52 88',
              'M 190 145 C 152 165 112 194 56 220',
              'M 190 145 C 212 108 236 74 272 52',
              'M 190 145 C 222 164 248 198 272 238',
              'M 190 145 C 188 108 186 68 184 26',
              'M 190 145 C 198 184 208 230 218 276',
            ].map((path) => (
              <path key={path} d={path} fill="none" stroke="#9e2f2c" strokeWidth={3.4} strokeLinecap="round" opacity={0.9} />
            ))}
            {[
              'M 145 120 C 120 106 95 98 72 96',
              'M 146 170 C 120 186 96 200 78 212',
              'M 226 122 C 244 106 256 92 266 78',
              'M 226 168 C 246 186 258 204 266 220',
            ].map((path) => (
              <path key={path} d={path} fill="none" stroke="#c05a3f" strokeWidth={1.7} strokeLinecap="round" opacity={0.8} />
            ))}

            <circle cx={190} cy={145} r={discR + 4} fill="#e8c9a2" opacity={0.45} />
            <circle cx={190} cy={145} r={discR} fill={rimColor} />
            <circle cx={190} cy={145} r={cupR} fill={`url(#${cupId})`} stroke="rgba(120,80,55,0.4)" strokeWidth={1} />
            <ellipse cx={190} cy={145 - discR + 5} rx={8 + cdr * 7} ry={3.5 + cdr * 2} fill="#f8ead5" opacity={defect * 0.9} />
            <ellipse cx={190} cy={145 + discR - 5} rx={7 + cdr * 6} ry={3 + cdr * 2} fill="#f8ead5" opacity={defect * 0.7} />

            <circle cx={86} cy={150} r={13} fill="#8e2e26" opacity={0.55} />
            <circle cx={86} cy={150} r={5} fill="#6f211c" opacity={0.65} />

            <text x={190} y={224} textAnchor="middle" fill="rgba(40,12,10,0.72)" fontSize={8.5}>
              optic disc
            </text>
            <text x={86} y={176} textAnchor="middle" fill="rgba(40,12,10,0.65)" fontSize={8}>
              macula
            </text>
          </svg>

          <svg viewBox="0 0 180 180" className="fundus-field-svg" role="img" aria-label="Schematic visual field with an arcuate defect">
            <defs>
              <clipPath id={clipId}>
                <circle cx={90} cy={90} r={72} />
              </clipPath>
            </defs>
            <circle cx={90} cy={90} r={72} fill="rgba(255,255,255,0.03)" stroke="var(--line-2)" />
            <g clipPath={`url(#${clipId})`}>
              {[36, 60, 84, 108, 132].map((value) => (
                <line key={`h${value}`} x1={18} y1={value} x2={162} y2={value} stroke="rgba(255,255,255,0.05)" />
              ))}
              {[36, 60, 84, 108, 132].map((value) => (
                <line key={`v${value}`} x1={value} y1={18} x2={value} y2={162} stroke="rgba(255,255,255,0.05)" />
              ))}
              <path
                d="M 38 92 A 52 52 0 0 1 142 92"
                fill="none"
                stroke="rgba(251,113,133,0.55)"
                strokeWidth={6 + defect * 20}
                strokeLinecap="round"
                opacity={0.25 + defect * 0.7}
              />
              {cdr > 0.75 && (
                <path
                  d="M 42 104 A 52 52 0 0 0 138 104"
                  fill="none"
                  stroke="rgba(251,113,133,0.45)"
                  strokeWidth={(cdr - 0.75) * 60}
                  strokeLinecap="round"
                  opacity={0.6}
                />
              )}
              <circle cx={90} cy={90} r={5} fill="rgba(251,113,133,0.45)" />
            </g>
            <line x1={90} y1={18} x2={90} y2={162} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
            <line x1={18} y1={90} x2={162} y2={90} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
            <text x={90} y={172} textAnchor="middle" fill="var(--dim)" fontSize={8}>
              illustrative field
            </text>
          </svg>
        </div>

        <div className="sim-legend">
          <span>
            <span className="legend-dot" style={{ background: rimColor }} /> Neuroretinal rim
          </span>
          <span>
            <span className="legend-dot" style={{ background: '#f7ead3' }} /> Cup
          </span>
          <span>
            <span className="legend-dot" style={{ background: '#fb7185' }} /> Arcuate defect
          </span>
        </div>
      </div>

      <div className="sim-controls">
        <div>
          <div className="control-row">
            <span className="control-label">Cup-to-disc ratio</span>
            <span className="mono small" style={{ color: 'var(--teal-2)' }}>
              {cdr.toFixed(2)}
            </span>
          </div>
          <input
            className="range"
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={cdr}
            onChange={(event) => setCdr(Number(event.target.value))}
            aria-label="Cup-to-disc ratio"
          />
        </div>

        <div>
          <div className="control-row">
            <span className="control-label">Intraocular pressure</span>
            <span className="mono small" style={{ color: 'var(--teal-2)' }}>
              {iop} mmHg
            </span>
          </div>
          <input
            className="range"
            type="range"
            min={10}
            max={40}
            step={1}
            value={iop}
            onChange={(event) => setIop(Number(event.target.value))}
            aria-label="Intraocular pressure in millimetres of mercury"
          />
          <div className="iop-bar" aria-hidden="true">
            <div className="iop-zone iop-zone-ok" />
            <div className="iop-zone iop-zone-warn" />
            <div className="iop-zone iop-zone-danger" />
            <span className="iop-marker" style={{ left: `${clamp(iopPercent, 0, 100)}%` }} />
          </div>
          <div className="row small dim" style={{ justifyContent: 'space-between', marginTop: 3 }}>
            <span>10</span>
            <span>22</span>
            <span>40 mmHg</span>
          </div>
        </div>

        <div className="cdr-readout">
          <div>
            <strong>{cdr.toFixed(2)}</strong>
            <div className="control-label">CDR</div>
          </div>
          <div>
            <strong>{Math.max(0, Math.round(rimThickness))}</strong>
            <div className="control-label">rim (relative)</div>
          </div>
          <div>
            <span className={`badge badge-${riskTone}`}>{risk}</span>
            <div className="control-label" style={{ marginTop: 5 }}>
              screening flag
            </div>
          </div>
        </div>

        <div className="sim-note">
          <strong>Reading the model.</strong> A larger cup means thinner neuroretinal rim. Rim
          notching, disc haemorrhage, asymmetry and progressive change matter more than a single CDR.
          IOP is a risk factor, not the definition of glaucoma.
        </div>

        <div className="row small dim" style={{ gap: 6 }}>
          <Info size={11} />
          <span>Illustrative only. Real assessment uses slit-lamp, OCT and perimetry.</span>
        </div>
      </div>
    </div>
  )
}

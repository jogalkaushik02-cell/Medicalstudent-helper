import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

interface Step {
  title: string
  detail: string
  headAngle: number
  position: string
  dot: [number, number]
  nystagmus: string
}

const STEPS: Step[] = [
  {
    title: 'Positive Dix–Hallpike',
    detail:
      'Sit the patient upright, turn the head 45° toward the affected ear, then lie them back with the head hanging about 20° below horizontal. After a short latency, upbeat torsional nystagmus appears and fatigues.',
    headAngle: 45,
    position: 'Supine, head turned to the affected ear and hanging 20°',
    dot: [331, 138],
    nystagmus: 'Upbeat, torsional nystagmus · latency 1–5 s · fatigable',
  },
  {
    title: 'Epley 1 — starting position',
    detail:
      'With the patient sitting, turn the head 45° toward the affected ear. The otoconia sit in the posterior canal; the aim is to walk them around the canal and into the utricle.',
    headAngle: 45,
    position: 'Sitting, head turned 45° to the affected ear',
    dot: [338, 88],
    nystagmus: 'No nystagmus expected in this position',
  },
  {
    title: 'Epley 2 — lie back',
    detail:
      'Lay the patient supine with the head still turned 45° and hanging 20° below horizontal. The otoconia move away from the cupula into the canal.',
    headAngle: 45,
    position: 'Supine, head hanging 20°, still turned to the affected ear',
    dot: [398, 45],
    nystagmus: 'Brief nystagmus may occur as the otoconia move',
  },
  {
    title: 'Epley 3 — rotate the head',
    detail:
      'Rotate the head 90° toward the unaffected side, so it is now 45° past midline. The otoconia continue around the posterior canal.',
    headAngle: -45,
    position: 'Supine, head rotated 90° to the unaffected side',
    dot: [448, 120],
    nystagmus: 'Nystagmus may again be provoked',
  },
  {
    title: 'Epley 4 — roll onto the side',
    detail:
      'Roll the patient onto the unaffected side, with the head turned further so the face points downward. The otoconia pass the common crus toward the utricle.',
    headAngle: -90,
    position: 'Lateral, unaffected side down, face angled toward the floor',
    dot: [420, 190],
    nystagmus: 'Usually settles',
  },
  {
    title: 'Epley 5 — sit up',
    detail:
      'Bring the patient upright with the head tilted forward. The otoconia now sit in the utricle, out of the posterior canal. Repeat or use a particle repositioning variant if symptoms persist.',
    headAngle: 0,
    position: 'Sitting, head tilted forward',
    dot: [350, 210],
    nystagmus: 'No further positional nystagmus if repositioning succeeded',
  },
]

export default function BppvSim() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <div className="sim-grid">
      <div className="bppv-wrap">
        <svg viewBox="0 0 520 300" className="bppv-svg" role="img" aria-label={`BPPV step ${step + 1}: ${current.title}`}>
          <defs>
            <radialGradient id="bppv-head" cx="45%" cy="38%" r="70%">
              <stop offset="0%" stopColor="#24384c" />
              <stop offset="100%" stopColor="#111b27" />
            </radialGradient>
            <linearGradient id="bppv-canal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5eead4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.14" />
            </linearGradient>
          </defs>

          <rect x={0} y={0} width={520} height={300} fill="rgba(255,255,255,0.012)" />

          <g transform="translate(118 146)">
            <line x1={-78} y1={94} x2={78} y2={94} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
            <g transform={`rotate(${current.headAngle})`}>
              <circle cx={0} cy={0} r={66} fill="url(#bppv-head)" stroke="rgba(148,180,205,0.35)" strokeWidth={1.5} />
              <path d="M 64 -9 L 92 0 L 64 9 Z" fill="#1b2a3a" stroke="rgba(148,180,205,0.3)" strokeWidth={1} />
              <path
                d="M -40 -4 C -56 -22 -60 6 -48 20 C -42 27 -34 18 -36 6"
                fill="none"
                stroke="#8ff7e8"
                strokeWidth={2}
                opacity={0.8}
              />
              <path d="M -30 58 C -12 74 12 74 30 58" fill="none" stroke="rgba(148,180,205,0.25)" strokeWidth={1.2} />
              <circle cx={-14} cy={-20} r={2.2} fill="#c7fff7" opacity={0.7} />
              <circle cx={10} cy={-26} r={1.8} fill="#c7fff7" opacity={0.5} />
              <path d="M -18 18 C -6 25 8 25 18 18" fill="none" stroke="rgba(199,255,247,0.35)" strokeWidth={1.4} />
            </g>
            <text x={0} y={124} textAnchor="middle" fill="var(--dim)" fontSize={8.5}>
              head orientation
            </text>
          </g>

          <g>
            <text x={400} y={24} textAnchor="middle" fill="var(--muted)" fontSize={9} letterSpacing="0.08em">
              POSTERIOR CANAL · SCHEMATIC
            </text>
            <path
              d="M 331 138 C 300 74 352 32 404 48 C 462 66 470 150 438 196 C 416 226 376 226 350 210"
              fill="none"
              stroke="rgba(232,220,200,0.2)"
              strokeWidth={34}
              strokeLinecap="round"
            />
            <path
              d="M 331 138 C 300 74 352 32 404 48 C 462 66 470 150 438 196 C 416 226 376 226 350 210"
              fill="none"
              stroke="url(#bppv-canal)"
              strokeWidth={11}
              strokeLinecap="round"
            />
            <ellipse cx={338} cy={216} rx={30} ry={18} fill="rgba(94,234,212,0.08)" stroke="rgba(94,234,212,0.28)" />
            <text x={338} y={247} textAnchor="middle" fill="var(--dim)" fontSize={8}>
              utricle
            </text>
            <circle cx={331} cy={138} r={8} fill="rgba(251,191,36,0.22)" stroke="rgba(251,191,36,0.55)" />
            <text x={300} y={140} textAnchor="end" fill="var(--dim)" fontSize={8}>
              cupula
            </text>
            <circle
              cx={current.dot[0]}
              cy={current.dot[1]}
              r={5.4}
              fill="#fbbf24"
              stroke="#fff7d6"
              strokeWidth={1.2}
            />
            <circle cx={current.dot[0]} cy={current.dot[1]} r={10} fill="#fbbf24" opacity={0.16} />
            <text x={current.dot[0] + 12} y={current.dot[1] - 8} fill="#fde68a" fontSize={8}>
              otoconia
            </text>
          </g>

          <text x={16} y={282} fill="var(--dim)" fontSize={8.5}>
            Step {step + 1} of {STEPS.length} · {current.position}
          </text>
        </svg>
      </div>

      <div className="sim-controls">
        <div className="epley-steps">
          {STEPS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`epley-step${index === step ? ' active' : ''}`}
              onClick={() => setStep(index)}
              aria-pressed={index === step}
            >
              <span className="flow-num" style={{ width: 18, height: 18, flexBasis: 18 }}>
                {index + 1}
              </span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="sim-note">
          <strong>{current.title}</strong>
          <div style={{ marginTop: 5 }}>{current.detail}</div>
          <div style={{ marginTop: 7, color: 'var(--amber)' }}>{current.nystagmus}</div>
        </div>

        <div className="row" style={{ gap: 6 }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
          >
            <ChevronLeft size={13} /> Previous
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setStep((value) => Math.min(STEPS.length - 1, value + 1))}
            disabled={step === STEPS.length - 1}
          >
            Next <ChevronRight size={13} />
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setStep(0)} aria-label="Reset BPPV steps">
            <RotateCcw size={13} />
          </button>
        </div>

        <div className="sim-note" style={{ marginTop: 0 }}>
          <strong>Why it works.</strong> Moving the head through these positions walks the otoconia
          out of the posterior canal and into the utricle, where they no longer deflect the cupula.
          The sequence is not suitable for every patient — assess the canal, neck and vascular risk
          first.
        </div>
      </div>
    </div>
  )
}

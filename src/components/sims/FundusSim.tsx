import { useId, useState } from 'react'
import { Info } from 'lucide-react'

type Mode = 'normal' | 'diabetic' | 'amd' | 'papilloedema'

const MODES: { id: Mode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'diabetic', label: 'Diabetic retinopathy' },
  { id: 'amd', label: 'Wet AMD' },
  { id: 'papilloedema', label: 'Papilloedema' },
]

const MICRO = [
  [112, 88],
  [98, 112],
  [124, 132],
  [80, 98],
  [68, 142],
  [146, 76],
  [158, 188],
  [72, 188],
  [138, 214],
  [52, 166],
  [206, 88],
  [230, 196],
]

const EXUDATES = [
  [96, 102],
  [118, 116],
  [84, 128],
  [140, 156],
  [64, 116],
  [110, 74],
]

const COTTON = [
  [148, 108],
  [78, 166],
  [198, 206],
  [58, 84],
]

const DRUSEN = [
  [74, 136],
  [82, 146],
  [92, 134],
  [100, 148],
  [68, 154],
  [86, 162],
  [104, 158],
  [112, 144],
  [96, 122],
  [78, 124],
]

export default function FundusSim() {
  const [mode, setMode] = useState<Mode>('diabetic')
  const uid = useId().replace(/:/g, '')
  const bgId = `${uid}-fundus-bg`
  const discId = `${uid}-disc`

  const caption =
    mode === 'normal'
      ? 'Normal fundus: sharp disc margins, a small central cup, healthy macula and normal vessel calibre.'
      : mode === 'diabetic'
        ? 'Non-proliferative diabetic retinopathy: microaneurysms, dot-blot haemorrhages, hard exudates and cotton-wool spots.'
        : mode === 'amd'
          ? 'Wet age-related macular degeneration: drusen plus a dark subretinal haemorrhage at the macula.'
          : 'Papilloedema: swollen, hyperaemic disc with blurred margins, engorged veins and peripapillary nerve-fibre swelling.'

  return (
    <div className="sim-grid">
      <div className="fundus-wrap">
        <svg viewBox="0 0 300 300" className="fundus-svg" role="img" aria-label={`Schematic fundus: ${caption}`}>
          <defs>
            <radialGradient id={bgId} cx="42%" cy="38%" r="72%">
              <stop offset="0%" stopColor="#f6b26b" />
              <stop offset="58%" stopColor="#dc7f4e" />
              <stop offset="100%" stopColor="#a84532" />
            </radialGradient>
            <radialGradient id={discId} cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor={mode === 'papilloedema' ? '#fff1d8' : '#fffaf0'} />
              <stop offset="100%" stopColor={mode === 'papilloedema' ? '#f3c38e' : '#ead6b8'} />
            </radialGradient>
          </defs>

          <circle cx={150} cy={150} r={144} fill={`url(#${bgId})`} />
          <circle cx={150} cy={150} r={144} fill="none" stroke="rgba(30,10,8,0.35)" strokeWidth={3} />

          {mode === 'papilloedema' && (
            <>
              <circle cx={190} cy={145} r={58} fill="#fff2d6" opacity={0.16} />
              <circle cx={190} cy={145} r={50} fill="#ffe1ae" opacity={0.2} />
            </>
          )}

          {[
            'M 190 145 C 150 120 108 100 52 88',
            'M 190 145 C 152 165 112 194 56 220',
            'M 190 145 C 212 108 236 74 272 52',
            'M 190 145 C 222 164 248 198 272 238',
            'M 190 145 C 188 108 186 68 184 26',
            'M 190 145 C 198 184 208 230 218 276',
          ].map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={mode === 'papilloedema' ? '#8e2422' : '#9e2f2c'}
              strokeWidth={mode === 'papilloedema' ? 4.8 : 3.4}
              strokeLinecap="round"
              opacity={0.9}
            />
          ))}
          {[
            'M 145 120 C 120 106 95 98 72 96',
            'M 146 170 C 120 186 96 200 78 212',
            'M 226 122 C 244 106 256 92 266 78',
            'M 226 168 C 246 186 258 204 266 220',
          ].map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={mode === 'papilloedema' ? '#a8322d' : '#c05a3f'}
              strokeWidth={mode === 'papilloedema' ? 2.4 : 1.7}
              strokeLinecap="round"
              opacity={0.85}
            />
          ))}

          {mode === 'papilloedema' && (
            <>
              <path d="M 136 102 A 54 54 0 0 1 244 102" fill="none" stroke="#ffe9c2" strokeWidth={3} opacity={0.35} />
              <path d="M 138 190 A 54 54 0 0 0 242 190" fill="none" stroke="#ffe9c2" strokeWidth={3} opacity={0.28} />
              <circle cx={190} cy={145} r={46} fill="#f4c08a" opacity={0.55} />
            </>
          )}

          <circle cx={190} cy={145} r={mode === 'papilloedema' ? 40 : 36} fill={`url(#${discId})`} opacity={mode === 'papilloedema' ? 0.95 : 1} />
          <circle
            cx={190}
            cy={145}
            r={mode === 'papilloedema' ? 22 : 13}
            fill="#f8ead2"
            stroke="rgba(120,80,55,0.35)"
            strokeWidth={1}
          />
          {mode === 'papilloedema' && (
            <>
              <circle cx={190} cy={145} r={48} fill="none" stroke="#f7d9ad" strokeWidth={5} opacity={0.22} />
              <circle cx={190} cy={145} r={54} fill="none" stroke="#f7d9ad" strokeWidth={3} opacity={0.14} />
            </>
          )}

          {mode === 'diabetic' && (
            <>
              {MICRO.map(([x, y], index) => (
                <circle key={`m${index}`} cx={x} cy={y} r={index % 3 === 0 ? 3.2 : 2.2} fill="#8e1f1c" opacity={0.8} />
              ))}
              {EXUDATES.map(([x, y], index) => (
                <circle key={`e${index}`} cx={x} cy={y} r={2.6} fill="#f7d36b" opacity={0.95} />
              ))}
              {COTTON.map(([x, y], index) => (
                <ellipse key={`c${index}`} cx={x} cy={y} rx={8} ry={5} fill="#f8f1df" opacity={0.72} />
              ))}
            </>
          )}

          {mode === 'amd' && (
            <>
              {DRUSEN.map(([x, y], index) => (
                <circle key={`d${index}`} cx={x} cy={y} r={2.4} fill="#f4d47a" opacity={0.9} />
              ))}
              <ellipse cx={94} cy={150} rx={22} ry={17} fill="#7e1d1a" opacity={0.72} />
              <ellipse cx={100} cy={146} rx={9} ry={7} fill="#5b1210" opacity={0.8} />
              <path d="M 78 138 C 88 132 104 132 112 140" fill="none" stroke="#f3c7b4" strokeWidth={2} opacity={0.4} />
            </>
          )}

          <circle cx={86} cy={150} r={13} fill="#8e2e26" opacity={0.5} />
          <circle cx={86} cy={150} r={5} fill="#6f211c" opacity={0.65} />
        </svg>

        <div className="sim-legend">
          <span>
            <span className="legend-dot" style={{ background: '#8e1f1c' }} /> Haemorrhage / microaneurysm
          </span>
          <span>
            <span className="legend-dot" style={{ background: '#f7d36b' }} /> Exudate / drusen
          </span>
          <span>
            <span className="legend-dot" style={{ background: '#f8f1df' }} /> Cotton-wool spot
          </span>
        </div>
      </div>

      <div className="sim-controls">
        <div>
          <div className="control-label" style={{ marginBottom: 5 }}>
            Fundus pattern
          </div>
          <div className="seg seg-wrap" role="group" aria-label="Fundus pattern">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`seg-btn${mode === item.id ? ' active' : ''}`}
                onClick={() => setMode(item.id)}
                aria-pressed={mode === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-note">
          <strong>{MODES.find((item) => item.id === mode)?.label}</strong>
          <div style={{ marginTop: 5 }}>{caption}</div>
        </div>

        <div className="sim-note" style={{ marginTop: 0 }}>
          <strong>Exam anchor.</strong> Diabetic retinopathy is graded by the worst lesion present.
          Macular oedema is the commonest cause of vision loss and can occur at any grade. In papilloedema,
          the blind spot enlarges and the disc margins blur — image the brain, do not just treat the eye.
        </div>

        <div className="row small dim" style={{ gap: 6 }}>
          <Info size={11} />
          <span>Hand-drawn teaching schematic; lesion counts and positions are illustrative.</span>
        </div>
      </div>
    </div>
  )
}

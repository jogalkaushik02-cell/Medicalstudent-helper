import { useId, useState } from 'react'
import { Eye, Info } from 'lucide-react'

type Defect =
  | 'none'
  | 'total'
  | 'left-half'
  | 'right-half'
  | 'upper-left'
  | 'lower-left'
  | 'left-sparing'

interface Lesion {
  id: string
  label: string
  rightEye: Defect
  leftEye: Defect
  summary: string
  localisation: string
}

const LESIONS: Lesion[] = [
  {
    id: 'normal',
    label: 'Normal',
    rightEye: 'none',
    leftEye: 'none',
    summary: 'Full fields in both eyes, with a physiological blind spot in each temporal field.',
    localisation: 'No lesion.',
  },
  {
    id: 'right-nerve',
    label: 'Right optic nerve',
    rightEye: 'total',
    leftEye: 'none',
    summary: 'Complete loss of vision in the right eye. The left eye is unaffected.',
    localisation: 'Prechiasmal, right optic nerve. Monocular loss; expect a right RAPD.',
  },
  {
    id: 'chiasm',
    label: 'Optic chiasm',
    rightEye: 'right-half',
    leftEye: 'left-half',
    summary: 'Bitemporal hemianopia: both temporal fields are lost.',
    localisation: 'Central chiasm, classically a pituitary adenoma. The temporal fibres cross here.',
  },
  {
    id: 'right-tract',
    label: 'Right optic tract',
    rightEye: 'left-half',
    leftEye: 'left-half',
    summary: 'Left homonymous hemianopia: the left half of the field is lost in both eyes.',
    localisation: 'Postchiasmal, right optic tract. Defects are often incongruous.',
  },
  {
    id: 'right-meyer',
    label: 'Right Meyer loop',
    rightEye: 'upper-left',
    leftEye: 'upper-left',
    summary: 'Left superior quadrantanopia — “pie in the sky”.',
    localisation: 'Right temporal lobe (Meyer loop). Inferior retina = superior field.',
  },
  {
    id: 'right-parietal',
    label: 'Right parietal radiation',
    rightEye: 'lower-left',
    leftEye: 'lower-left',
    summary: 'Left inferior quadrantanopia — “pie on the floor”.',
    localisation: 'Right parietal lobe (Baumgarten radiation). Superior retina = inferior field.',
  },
  {
    id: 'right-occipital',
    label: 'Right occipital cortex',
    rightEye: 'left-sparing',
    leftEye: 'left-sparing',
    summary: 'Left homonymous hemianopia with macular sparing.',
    localisation:
      'Right occipital cortex. The occipital pole has dual MCA/PCA supply, so central vision may be spared.',
  },
]

const shadeColor = 'rgba(251, 113, 133, 0.42)'

function FieldChart({ defect, label }: { defect: Defect; label: string }) {
  const uid = useId().replace(/:/g, '')
  const clipId = `${uid}-clip`
  const maskId = `${uid}-mask`
  const blindSpotX = label.startsWith('Right') ? 122 : 38

  const half = (side: 'left' | 'right') =>
    side === 'left' ? (
      <rect x={18} y={18} width={62} height={124} fill={shadeColor} />
    ) : (
      <rect x={80} y={18} width={62} height={124} fill={shadeColor} />
    )

  const shading = () => {
    switch (defect) {
      case 'total':
        return <circle cx={80} cy={80} r={62} fill={shadeColor} />
      case 'left-half':
        return half('left')
      case 'right-half':
        return half('right')
      case 'upper-left':
        return <rect x={18} y={18} width={62} height={62} fill={shadeColor} />
      case 'lower-left':
        return <rect x={18} y={80} width={62} height={62} fill={shadeColor} />
      case 'left-sparing':
        return (
          <g mask={`url(#${maskId})`}>
            <rect x={18} y={18} width={62} height={124} fill={shadeColor} />
          </g>
        )
      default:
        return null
    }
  }

  return (
    <div className="field-eye">
      <div className="field-label">{label}</div>
      <svg viewBox="0 0 160 160" className="field-mini" role="img" aria-label={`${label} visual field`}>
        <defs>
          <clipPath id={clipId}>
            <circle cx={80} cy={80} r={62} />
          </clipPath>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={160} height={160}>
            <rect width={160} height={160} fill="white" />
            <circle cx={80} cy={80} r={12} fill="black" />
          </mask>
        </defs>

        <circle cx={80} cy={80} r={62} fill="rgba(255,255,255,0.025)" stroke="var(--line-2)" strokeWidth={1} />
        <g clipPath={`url(#${clipId})`}>
          <g opacity={0.9}>
            {[26, 44, 62, 80, 98, 116, 134].map((value) => (
              <line
                key={`h-${value}`}
                x1={18}
                y1={value}
                x2={142}
                y2={value}
                stroke="rgba(255,255,255,0.055)"
                strokeWidth={0.6}
              />
            ))}
            {[26, 44, 62, 80, 98, 116, 134].map((value) => (
              <line
                key={`v-${value}`}
                x1={value}
                y1={18}
                x2={value}
                y2={142}
                stroke="rgba(255,255,255,0.055)"
                strokeWidth={0.6}
              />
            ))}
          </g>
          {shading()}
          <circle cx={blindSpotX} cy={86} r={4.2} fill="#0a0f16" stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />
        </g>
        <line x1={80} y1={18} x2={80} y2={142} stroke="rgba(255,255,255,0.16)" strokeWidth={0.8} strokeDasharray="3 4" />
        <line x1={18} y1={80} x2={142} y2={80} stroke="rgba(255,255,255,0.16)" strokeWidth={0.8} strokeDasharray="3 4" />
        <text x={80} y={153} textAnchor="middle" fill="var(--dim)" fontSize={7}>
          {label.startsWith('Right') ? 'temporal ← → nasal' : 'nasal ← → temporal'}
        </text>
      </svg>
    </div>
  )
}

export default function VisualFieldSim({ defaultLesion = 'chiasm' }: { defaultLesion?: string }) {
  const [lesionId, setLesionId] = useState(defaultLesion)
  const lesion = LESIONS.find((item) => item.id === lesionId) ?? LESIONS[0]

  return (
    <div>
      <div className="lesion-buttons" role="group" aria-label="Choose a lesion location">
        {LESIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`lesion-btn${item.id === lesion.id ? ' active' : ''}`}
            onClick={() => setLesionId(item.id)}
            aria-pressed={item.id === lesion.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="field-panel">
        <FieldChart defect={lesion.rightEye} label="Right eye (OD)" />
        <FieldChart defect={lesion.leftEye} label="Left eye (OS)" />
      </div>

      <div className="sim-note">
        <strong>{lesion.label}</strong> — {lesion.summary}
        <div style={{ marginTop: 5, color: 'var(--dim)' }}>{lesion.localisation}</div>
      </div>

      <div className="row wrap small dim" style={{ marginTop: 9, gap: 14 }}>
        <span className="row" style={{ gap: 5 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: shadeColor,
              border: '1px solid rgba(251,113,133,0.5)',
            }}
          />
          Field defect
        </span>
        <span className="row" style={{ gap: 5 }}>
          <Eye size={11} /> Blind spot
        </span>
        <span className="row" style={{ gap: 5 }}>
          <Info size={11} /> Shading is schematic; perimetry is quantitative.
        </span>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Stethoscope,
  Waypoints,
} from 'lucide-react'
import {
  clinicalCases,
  diseases,
  pathwaysById,
  structuresById,
} from '../data'
import { Badge, Disclaimer, SystemBadge } from '../components/ui'
import VisualFieldSim from '../components/VisualFieldSim'
import NotFound from './NotFound'

export default function PathwayDetail() {
  const { id } = useParams()
  const pathway = id ? pathwaysById[id] : undefined
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [id])

  if (!pathway) return <NotFound />

  const step = pathway.steps[active] ?? pathway.steps[0]
  const eye = pathway.system === 'eye'
  const structures = pathway.structures.map((structureId) => structuresById[structureId]).filter(Boolean)
  const relatedDiseases = diseases
    .filter((disease) => disease.structures.some((structureId) => pathway.structures.includes(structureId)))
    .slice(0, 6)
  const relatedCases = clinicalCases
    .filter((item) => relatedDiseases.some((disease) => disease.id === item.diagnosisId))
    .slice(0, 3)

  return (
    <div className="page">
      <div className={`detail-hero${eye ? ' eye' : ''}`}>
        <div className="row wrap" style={{ gap: 6 }}>
          <SystemBadge system={pathway.system} />
          <Badge>{pathway.steps.length} steps</Badge>
          <Badge tone="warn">Review pending</Badge>
        </div>
        <h1>{pathway.name}</h1>
        <p className="tagline">{pathway.tagline}</p>
        <p className="muted" style={{ maxWidth: 860, marginTop: 10, fontSize: 12.5, lineHeight: 1.65 }}>
          {pathway.summary}
        </p>
        <div className="hero-actions">
          <Link to={eye ? '/eye' : '/ear'} className="btn btn-primary btn-sm">
            <Box size={13} /> Open 3D explorer
          </Link>
          <Link to="/pathways" className="btn btn-sm">
            All pathways <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="pathway-layout">
        <div className="pathway-flow" aria-label={`${pathway.name} steps`}>
          {pathway.steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`flow-step${index === active ? ' active' : ''}`}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
            >
              <span className="flow-num">{String(index + 1).padStart(2, '0')}</span>
              <span style={{ minWidth: 0 }}>
                <span className="flow-label" style={{ display: 'block' }}>
                  {item.label}
                </span>
                <span className="flow-detail" style={{ display: 'block' }}>
                  {item.detail}
                </span>
              </span>
            </button>
          ))}
        </div>

        <aside>
          <div className="card pathway-side">
            <div className="detail-head">
              <Badge tone="ear">
                Step {active + 1} of {pathway.steps.length}
              </Badge>
            </div>
            <h3>{step.label}</h3>
            <p>{step.detail}</p>
            {step.lesion && (
              <div className="lesion-box">
                <strong>Lesion · </strong>
                {step.lesion}
              </div>
            )}
            <div className="row" style={{ gap: 6, marginTop: 13 }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setActive((value) => Math.max(0, value - 1))}
                disabled={active === 0}
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setActive((value) => Math.min(pathway.steps.length - 1, value + 1))}
                disabled={active === pathway.steps.length - 1}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {pathway.id === 'visual' && (
            <div className="card pathway-side" style={{ marginTop: 12 }}>
              <h3>Visual field localiser</h3>
              <p>
                Choose a lesion and compare the two monocular fields. The charts are schematic; the
                pattern is what matters.
              </p>
              <VisualFieldSim defaultLesion="chiasm" />
            </div>
          )}

          <div className="card pathway-side" style={{ marginTop: 12 }}>
            <h3>Rules of thumb</h3>
            <ul className="visual-notes" style={{ paddingLeft: 16 }}>
              {pathway.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="card pathway-side" style={{ marginTop: 12 }}>
            <h3>Structures in this pathway</h3>
            <div className="structure-chips">
              {structures.map((structure) => (
                <Link
                  key={structure.id}
                  to={`/${structure.system}?select=${structure.id}`}
                  className="chip chip-link"
                >
                  {structure.name}
                </Link>
              ))}
            </div>
          </div>

          {relatedDiseases.length > 0 && (
            <div className="card pathway-side" style={{ marginTop: 12 }}>
              <h3>Lesions to know</h3>
              <div className="linked-list">
                {relatedDiseases.map((disease) => (
                  <Link key={disease.id} to={`/diseases/${disease.id}`} className="linked-item">
                    <span>
                      <Stethoscope size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                      {disease.name}
                    </span>
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedCases.length > 0 && (
            <div className="card pathway-side" style={{ marginTop: 12 }}>
              <h3>Related cases</h3>
              <div className="linked-list">
                {relatedCases.map((item) => (
                  <Link key={item.id} to={`/cases?case=${item.id}`} className="linked-item">
                    <span>
                      <ClipboardList size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                      {item.title}
                    </span>
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <Disclaimer compact />
          </div>
        </aside>
      </div>

      <div className="cta-band" style={{ marginTop: 28 }}>
        <div>
          <h2>Next: {eye ? 'test the visual field' : 'test the pathway'}</h2>
          <p>
            {eye
              ? 'Use the visual-field localiser above, then try a neuro-ophthalmology case.'
              : 'Work through a related ENT case and explain the lesion level out loud.'}
          </p>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <Link to="/cases" className="btn btn-primary">
            <ClipboardList size={14} /> Clinical cases
          </Link>
          <Link to="/simulations" className="btn">
            <Waypoints size={14} /> Simulations
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Box,
  ClipboardList,
  FlaskConical,
  ShieldAlert,
  Stethoscope,
  Waypoints,
} from 'lucide-react'
import {
  clinicalCases,
  diseasesById,
  pathways,
  structuresForDisease,
} from '../data'
import type { Disease, SimKind } from '../data'
import { Badge, Bullets, Disclaimer, Section, SystemBadge } from '../components/ui'
import NotFound from './NotFound'

const OVERLAY_BY_DISEASE: Record<string, string> = {
  'acute-otitis-media': 'aom',
  'otitis-externa': 'otitis-externa',
  cholesteatoma: 'cholesteatoma',
  otosclerosis: 'otosclerosis',
  'acoustic-neuroma': 'schwannoma',
}

function simHref(disease: Disease, sim: SimKind) {
  switch (sim) {
    case 'ear-overlay': {
      const overlay = OVERLAY_BY_DISEASE[disease.id]
      return overlay ? `/ear?overlay=${overlay}` : '/ear'
    }
    case 'audiogram':
      return '/simulations#audiogram'
    case 'bppv':
      return '/simulations#bppv'
    case 'airway':
      return '/simulations#airway'
    case 'cataract':
      return '/simulations#cataract'
    case 'glaucoma':
      return '/simulations#glaucoma'
    case 'visual-field':
      return '/pathways/visual'
    case 'fundus':
      return '/simulations#fundus'
    default:
      return '/simulations'
  }
}

export default function DiseaseDetail() {
  const { id } = useParams()
  const disease = id ? diseasesById[id] : undefined
  if (!disease) return <NotFound />

  const anatomy = structuresForDisease(disease.id)
  const relatedCases = clinicalCases.filter((item) => item.diagnosisId === disease.id)
  const relatedPathways = pathways.filter((pathway) =>
    pathway.structures.some((structureId) => disease.structures.includes(structureId)),
  )
  const eye = disease.system === 'ophtho'
  const anatomyTarget = anatomy[0]
    ? `/${anatomy[0].system}?select=${anatomy[0].id}`
    : eye
      ? '/eye'
      : '/ear'

  return (
    <div className="page">
      <div className={`detail-hero${eye ? ' eye' : ''}`}>
        <div className="row wrap" style={{ gap: 6 }}>
          <SystemBadge system={disease.system} />
          <Badge>{disease.category}</Badge>
          {disease.sim && <Badge tone="ok">Interactive simulator</Badge>}
          <Badge tone="warn">Review pending</Badge>
        </div>
        <h1>{disease.name}</h1>
        <p className="tagline">{disease.tagline}</p>
        <p className="muted" style={{ maxWidth: 820, marginTop: 10, fontSize: 12.5, lineHeight: 1.65 }}>
          {disease.definition}
        </p>
        {disease.epidemiology && (
          <p className="dim small" style={{ maxWidth: 820, marginTop: 8 }}>
            <strong style={{ color: 'var(--muted)' }}>Epidemiology · </strong>
            {disease.epidemiology}
          </p>
        )}

        <div className="hero-actions">
          <Link to={anatomyTarget} className="btn btn-primary btn-sm">
            <Box size={13} /> View related anatomy
          </Link>
          {disease.sim && (
            <Link to={simHref(disease, disease.sim)} className="btn btn-sm">
              <FlaskConical size={13} /> Open simulator
            </Link>
          )}
          <Link to="/diseases" className="btn btn-ghost btn-sm">
            All diseases <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="detail-columns">
        <div>
          <Section title="Pathophysiology">
            <Bullets items={disease.pathophysiology} />
          </Section>
          <Section title="Risk factors">
            <Bullets items={disease.riskFactors} />
          </Section>
          <Section title="Symptoms">
            <Bullets items={disease.symptoms} />
          </Section>
          <Section title="Signs">
            <Bullets items={disease.signs} />
          </Section>
          <Section title="Investigations">
            <Bullets items={disease.investigations} />
          </Section>
          <Section title="Treatment" className={eye ? 'eye' : undefined}>
            <Bullets items={disease.treatment} />
          </Section>
          {disease.complications && disease.complications.length > 0 && (
            <Section title="Complications">
              <Bullets items={disease.complications} />
            </Section>
          )}
        </div>

        <aside>
          <Section title="Exam pearls">
            {disease.pearls.map((pearl) => (
              <div key={pearl} className="pearl" style={{ marginBottom: 7 }}>
                {pearl}
              </div>
            ))}
          </Section>

          {disease.complications && disease.complications.length > 0 && (
            <div className="danger-box" style={{ marginBottom: 13 }}>
              <h3>
                <ShieldAlert size={12} style={{ marginRight: 5, verticalAlign: -2 }} />
                Do not miss
              </h3>
              <ul>
                {disease.complications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <Section title="Anatomy">
            {anatomy.length > 0 ? (
              <div className="structure-chips">
                {anatomy.map((structure) => (
                  <Link
                    key={structure.id}
                    to={`/${structure.system}?select=${structure.id}`}
                    className="chip chip-link"
                  >
                    {structure.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="small muted">
                This condition is included as general ENT content; its anatomy is outside the current
                ear/eye 3D models.
              </p>
            )}
          </Section>

          {relatedPathways.length > 0 && (
            <Section title="Pathways">
              <div className="linked-list">
                {relatedPathways.map((pathway) => (
                  <Link key={pathway.id} to={`/pathways/${pathway.id}`} className="linked-item">
                    <span>
                      <Waypoints size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                      {pathway.name}
                    </span>
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {relatedCases.length > 0 && (
            <Section title="Related cases">
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
            </Section>
          )}

          <Section title="Explore next">
            <div className="linked-list">
              <Link to={anatomyTarget} className="linked-item">
                <span>
                  <Stethoscope size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                  Open the 3D explorer
                </span>
                <ArrowRight size={12} />
              </Link>
              <Link to="/cases" className="linked-item">
                <span>Work through a case</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </Section>

          <Disclaimer compact />
        </aside>
      </div>
    </div>
  )
}

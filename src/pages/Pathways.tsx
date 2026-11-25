import { Link } from 'react-router-dom'
import { ArrowRight, Waypoints } from 'lucide-react'
import { pathways } from '../data'
import { Badge, PageHead, SystemBadge } from '../components/ui'

export default function Pathways() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Trace the signal"
        title="Pathways"
        subtitle="Follow the visual, auditory, facial and pupillary pathways from receptor to cortex — with the lesion syndrome at every step. The visual pathway includes an interactive field localiser."
        actions={
          <>
            <Link to="/simulations" className="btn btn-sm">
              Simulations
            </Link>
            <Link to="/cases" className="btn btn-sm btn-primary">
              Test yourself
            </Link>
          </>
        }
      />

      <div className="pathway-grid">
        {pathways.map((pathway) => (
          <Link key={pathway.id} to={`/pathways/${pathway.id}`} className="card pathway-card">
            <div className="pathway-card-head">
              <SystemBadge system={pathway.system} />
              <Badge>{pathway.steps.length} steps</Badge>
            </div>
            <h3>{pathway.name}</h3>
            <p>{pathway.tagline}</p>
            <p style={{ marginTop: 8, color: 'var(--dim)' }}>{pathway.summary.slice(0, 178)}…</p>

            <div className="pathway-steps-mini">
              {pathway.steps.slice(0, 5).map((step, index) => (
                <span key={step.id} className="chip">
                  {index + 1}. {step.label}
                </span>
              ))}
              {pathway.steps.length > 5 && <span className="chip">+{pathway.steps.length - 5}</span>}
            </div>

            <span className="system-link" style={{ marginTop: 16 }}>
              Trace the pathway <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>

      <div className="cta-band">
        <div>
          <h2>Lesion localisation is pattern recognition</h2>
          <p>
            Before the chiasm is monocular. At the chiasm is bitemporal. After the chiasm is
            contralateral homonymous. The visual-field simulator lets you test that rule.
          </p>
        </div>
        <Link to="/pathways/visual" className="btn btn-primary">
          <Waypoints size={14} /> Visual pathway
        </Link>
      </div>
    </div>
  )
}

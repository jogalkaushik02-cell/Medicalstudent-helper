import { useMemo } from 'react'
import { ArrowRight, Ear, Eye, FlaskConical, Layers, Waypoints } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { allStructures, diseases, pathways, clinicalCases, searchIndex } from '../data'
import SuggestionBar from '../components/SuggestionBar'

export default function Home() {
  const navigate = useNavigate()
  const counts = useMemo(() => {
    const counts = { structures: allStructures.length, diseases: 0, pathways: 0, cases: 0, searches: 0 }
    for (const item of searchIndex) {
      if (item.kind === 'structure') continue
      if (item.kind === 'disease') counts.diseases += 1
      if (item.kind === 'pathway') counts.pathways += 1
      if (item.kind === 'case') counts.cases += 1
    }
    counts.searches = allStructures.length + counts.diseases + counts.pathways + counts.cases
    return counts
  }, [])

  return (
    <div className="home-gate">
      <div className="gate-orb">
        <PortalRing
          icon={<Ear size={26} />}
          label="Ear"
          section="ear"
          onEnter={() => navigate('/sections')}
        />
        <PortalRing
          icon={<Eye size={26} />}
          label="Eye"
          section="eye"
          delay="0.35s"
          onEnter={() => navigate('/sections')}
        />
        <PortalRing
          icon={<Layers size={26} />}
          label="Nose"
          section="nose"
          delay="0.7s"
          onEnter={() => navigate('/sections')}
        />
        <PortalRing
          icon={<Waypoints size={26} />}
          label="Pharynx"
          section="pharynx"
          delay="1.05s"
          onEnter={() => navigate('/sections')}
        />
        <PortalRing
          icon={<FlaskConical size={26} />}
          label="Larynx"
          section="larynx"
          delay="1.4s"
          onEnter={() => navigate('/sections')}
        />
        <span className="gate-core">Five</span>
      </div>

      <div className="gate-content">
        <div className="row wrap" style={{ gap: 7 }}>
          <span className="pill">SENSE ATLAS — v0.1 REVIEW PREVIEW</span>
          <span className="pill pill-accent">CREDITS</span>
        </div>
        <h1 className="gate-title">
          Five senses.
          <br />
          One learning journey.
        </h1>
        <p className="gate-sub">
          Explore interactive anatomy, searchable disease and pathway content, clinical cases and
          teaching simulators.
        </p>

        <div className="credits-line">
          <span className="credit-label">Created by</span>
          <span className="credit-name">Kaushik Jogal</span>
          <span className="credit-divider" />
          <span className="credit-label">AI build partner</span>
          <span className="credit-name credit-name-second">DeepSeek V4.1 Flash Free</span>
        </div>

        <div className="golden-disclaimer">
          <strong>EDUCATIONAL USE ONLY — NOT FOR DIAGNOSIS, TREATMENT, OR PATIENT CARE.</strong>
          This build is an educational preview, not a medical device. See{' '}
          <Link to="/about" className="golden-disclaimer-link">
            accuracy and limitations.
          </Link>
        </div>

        <SuggestionBar />

        <div className="gate-actions">
          <Link to="/sections" className="btn btn-primary btn-large" onClick={() => {}}>
            <ArrowRight size={16} /> Continue to the atlas
          </Link>
          <Link to="/ear" className="btn btn-ghost">
            Jump straight to the ear explorer
          </Link>
        </div>

        <div className="gate-stats">
          <Stat value={counts.structures} label="Structures" />
          <Stat value={counts.diseases} label="Diseases" />
          <Stat value={counts.pathways} label="Pathways" />
          <Stat value={counts.searches} label="Searchable items" />
        </div>
      </div>
    </div>
  )
}

function PortalRing({ icon, label, section, delay, onEnter }: { icon: React.ReactNode; label: string; section: string; delay?: string; onEnter: () => void }) {
  return (
    <Link
      to={`/${section}`}
      className="portal-ring"
      style={{ '--delay': delay } as React.CSSProperties}
      aria-label={`Open the ${label} section`}
      onClick={(event) => {
        event.preventDefault()
        onEnter()
      }}
      onMouseEnter={() => onEnter()}
      onFocus={() => onEnter()}
    >
      <span className="portal-ring-icon">{icon}</span>
      <span className="portal-ring-label">{label}</span>
    </Link>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="gate-stat">
      <div className="gate-stat-value">{value}</div>
      <div className="gate-stat-label">{label}</div>
    </div>
  )
}


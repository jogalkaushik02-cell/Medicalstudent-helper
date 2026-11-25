import { useState } from 'react'
import { ArrowRight, ExternalLink, Stethoscope, Waypoints } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  casesForSection,
  diseasesForSection,
  searchAll,
  sectionLabel,
  portalsById,
  diseasesById,
  type SearchItem,
  type SectionId,
} from '../data'
import { Badge, Disclaimer, SystemBadge } from '../components/ui'
import AnatomyMap from '../components/AnatomyMap'
import SectionSearch from '../components/SectionSearch'
import SuggestionBar from '../components/SuggestionBar'

export default function SectionPage({ sectionId }: { sectionId: SectionId }) {
  const [selected, setSelected] = useState('')
  const portal = portalsById[sectionId]
  const region = selected ? portal.regions.find((item) => item.id === selected) : undefined
  const dise = diseasesForSection(sectionId)
  const siteCases = casesForSection(sectionId)
  const section = sectionLabel[sectionId]

  const searchResults = searchAll('', 10).filter((item: SearchItem) => item.section === sectionId)

  return (
    <div className="page">
      <SuggestionBar full={false} />

      <div className={`section-hero ${sectionId}`}>
        <div className="row wrap" style={{ gap: 5 }}>
          <SystemBadge system={sectionId} />
          <Badge tone="ok">{dise.length} conditions</Badge>
        </div>
        <h1>{section}</h1>
        <p className="section-sub">{portal.description}</p>
      </div>

      <SectionSearch section={sectionId} />

      <div className="section-grid">
        <div className="section-map">
          <AnatomyMap portal={portal} selected={selected} setSelected={setSelected} />
        </div>
        <div className="section-sidebar">
          {region && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="detail-head">
                <h3>{region.name}</h3>
              </div>
              <p>{region.summary}</p>
              <div className="detail-section">
                <h4>Relations</h4>
                <p className="small muted">{region.relations}</p>
              </div>
              {region.clinical.length > 0 && (
                <div className="detail-section">
                  <h4>Clinical relevance</h4>
                  <ul>
                    {region.clinical.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {region.diseases.length > 0 && (
                <div className="detail-section">
                  <h4>Diseases here</h4>
                  <div className="structure-chips">
                    {region.diseases.map((id) => (
                      <Link key={id} to={`/diseases/${id}`} className="chip chip-link">
                        {diseasesById[id]?.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {portal.redFlags.length > 0 && (
            <div className="card" style={{ marginBottom: 14 }}>
              <h3>Red flags here</h3>
              <ul className="limit-list">
                {portal.redFlags.map((item) => (
                  <li key={item} className="danger-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {portal.sims.length > 0 && (
            <div className="card" style={{ marginBottom: 14 }}>
              <h3>Interactive tools</h3>
              <div className="linked-list">
                {portal.sims.map((link) => (
                  <Link key={link.href} to={link.href} className="linked-item">
                    <span>
                      <Waypoints size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                      {link.label}
                    </span>
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {dise.length > 0 && (
        <div className="section-learn">
          <h2 className="section-learn-title">Conditions in this section</h2>
          <div className="cases-grid">
            {dise.slice(0, 8).map((item) => (
              <Link key={item.id} to={`/diseases/${item.id}`} className="card disease-card">
                <div className="disease-card-top">
                  <SystemBadge system={sectionId} />
                  <Badge tone="warn">{section}</Badge>
                </div>
                <h3>{item.name}</h3>
                <p className="muted small" style={{ marginBottom: 9 }}>{item.tagline}</p>
                <span className="system-link">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {siteCases.length > 0 && (
        <div className="section-learn">
          <h2 className="section-learn-title">Clinical cases here</h2>
          <div className="cases-grid">
            {siteCases.slice(0, 4).map((item) => (
              <Link key={item.id} to={`/cases?case=${item.id}`} className="card case-card">
                <h3>{item.title}</h3>
                <p className="muted small">{item.vignette.slice(0, 120)}…</p>
                <span className="system-link">
                  <Stethoscope size={12} style={{ marginRight: 4 }} />
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="section-foot">
        <div className="dim">
          More about this portal: <Link to={`/${sectionId}`} className="cta-link">browse all {section.toLowerCase()} content</Link> — or use{' '}
          <Link to="/diseases" className="cta-link">all ENT and ophthalmology conditions</Link>.
        </div>
        <a className="cta-link external" href="https://wa.me/9193163904" target="_blank" rel="noreferrer">
          <ExternalLink size={12} style={{ marginRight: 5 }} /> Suggest via WhatsApp
        </a>
      </div>

      <Disclaimer compact />
    </div>
  )
}


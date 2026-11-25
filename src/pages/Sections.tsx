import { Link } from 'react-router-dom'
import { ArrowRight, Ear, Eye, Megaphone, Speech, ScanLine } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { searchIndex, type SearchItem, type SectionId } from '../data'
import SuggestionBar from '../components/SuggestionBar'

const icons: Record<SectionId, LucideIcon> = {
  ear: Ear,
  nose: ScanLine,
  pharynx: Speech,
  larynx: Megaphone,
  eye: Eye,
}

const tags: Record<SectionId, { tagline: string; kicker: string; count: string }> = {
  ear: { tagline: 'Hearing, balance and the ossicles', kicker: '3D explorer · audiograms · BPPV', count: 'anatomy' },
  nose: { tagline: 'Septum, turbinates and sinuses', kicker: 'interactive lateral wall', count: 'search result' },
  pharynx: { tagline: 'The shared airway across medicine', kicker: 'interactive map', count: 'content' },
  larynx: { tagline: 'Voice, airway and swallow', kicker: 'interactive coronal map', count: 'content' },
  eye: { tagline: 'The globe, retina and optical pathways', kicker: '3D explorer', count: 'content' },
}

export default function Sections() {
  const counts = new Map<SectionId, number>()
  for (const item of searchIndex) {
    if (!item.section) continue
    counts.set(item.section, (counts.get(item.section) ?? 0) + 1)
  }

  return (
    <div className="page">
      <SuggestionBar full />

      <div className="sections-hero">
        <div className="row wrap" style={{ gap: 7 }}>
          <span className="pill">Choose a portal</span>
          <span className="pill pill-accent">Five sections</span>
        </div>
        <h1 className="sections-title">
          Pick your portal
          <br />
          <em>Five senses. One learning journey.</em>
        </h1>
        <p className="sections-lead">
          Ear with the balance system, Nose where air meets sinuses, Pharynx as a shared airway, Larynx for
          voice and air, or Eye with the fastest nerves. Inside each: searchable conditions, pathways,
          simulators and clinical cases.
        </p>
      </div>

      <div className="sections-grid">
        {(['ear', 'nose', 'pharynx', 'larynx', 'eye'] as SectionId[]).map((section) => {
          const Icon = icons[section]
          const count = counts.get(section) ?? 0
          return (
            <Link key={section} to={`/${section}`} className={`section-card ${section}`} aria-label={`Open ${section}`}>
              <div className="section-card-head">
                <Icon size={22} strokeWidth={1.6} />
                <span className="section-count">{count}</span>
              </div>
              <h3 className="section-card-title">{section[0]?.toUpperCase() + section.slice(1)}</h3>
              <p className="section-card-text">{tags[section].tagline}</p>
              <div className="section-card-foot">
                <span className="section-card-kicker">{tags[section].kicker}</span>
                <span className="section-card-link">
                  Enter
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

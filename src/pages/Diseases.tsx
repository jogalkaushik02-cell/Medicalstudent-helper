import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, Stethoscope } from 'lucide-react'
import { diseases } from '../data'
import { Badge, EmptyState, PageHead, SystemBadge } from '../components/ui'

type SystemFilter = 'all' | 'ent' | 'ophtho'

export default function Diseases() {
  const [params, setParams] = useSearchParams()
  const systemParam = params.get('system')
  const system: SystemFilter = systemParam === 'ent' || systemParam === 'ophtho' ? systemParam : 'all'
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const categories = useMemo(() => {
    const pool = system === 'all' ? diseases : diseases.filter((item) => item.system === system)
    return Array.from(new Set(pool.map((item) => item.category))).sort()
  }, [system])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return diseases.filter((item) => {
      if (system !== 'all' && item.system !== system) return false
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      const haystack = [
        item.name,
        item.category,
        item.tagline,
        item.definition,
        ...item.tags,
        ...item.symptoms,
        ...item.signs,
      ]
        .join(' ')
        .toLowerCase()
      return q.split(/\s+/).every((token) => haystack.includes(token))
    })
  }, [system, category, query])

  const setSystem = (value: SystemFilter) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete('system')
    else next.set('system', value)
    setParams(next, { replace: true })
    setCategory('all')
  }

  return (
    <div className="page">
      <PageHead
        eyebrow="Clinical reference"
        title="Diseases"
        subtitle="ENT and ophthalmology conditions with pathophysiology, red flags, investigations, treatment and links back to the relevant anatomy. Content is versioned and pending independent clinical review."
        actions={
          <>
            <Link to="/simulations" className="btn btn-sm">
              Simulators
            </Link>
            <Link to="/cases" className="btn btn-sm btn-primary">
              Clinical cases
            </Link>
          </>
        }
      />

      <div className="filter-row" role="group" aria-label="Filter by system">
        <button type="button" className={`filter-btn${system === 'all' ? ' active' : ''}`} onClick={() => setSystem('all')} aria-pressed={system === 'all'}>
          All systems · {diseases.length}
        </button>
        <button type="button" className={`filter-btn${system === 'ent' ? ' active' : ''}`} onClick={() => setSystem('ent')} aria-pressed={system === 'ent'}>
          ENT · {diseases.filter((item) => item.system === 'ent').length}
        </button>
        <button type="button" className={`filter-btn${system === 'ophtho' ? ' active' : ''}`} onClick={() => setSystem('ophtho')} aria-pressed={system === 'ophtho'}>
          Ophthalmology · {diseases.filter((item) => item.system === 'ophtho').length}
        </button>
      </div>

      <div className="disease-filters">
        <label className="filter-search">
          <Search size={14} />
          <span className="sr-only">Search diseases</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name, symptom, sign or tag…"
          />
        </label>

        <label className="filter-select">
          <Filter size={13} />
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <span className="small dim" style={{ marginLeft: 'auto' }}>
          {filtered.length} shown
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No diseases match" text="Clear the search or choose a different system/category." />
      ) : (
        <div className="grid-3" style={{ marginTop: 14 }}>
          {filtered.map((disease) => (
            <Link key={disease.id} to={`/diseases/${disease.id}`} className="card disease-card">
              <div className="disease-card-top">
                <SystemBadge system={disease.system} />
                {disease.sim && <Badge tone="ok">Simulator</Badge>}
              </div>
              <div className="dim small" style={{ marginBottom: 5 }}>
                {disease.category}
              </div>
              <h3>{disease.name}</h3>
              <p>{disease.tagline}</p>
              <div className="disease-meta">
                {disease.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="accuracy-banner" style={{ marginTop: 26 }}>
        <Stethoscope size={16} style={{ flex: '0 0 auto', marginTop: 1 }} />
        <div>
          <strong>Reference use only.</strong> Doses, thresholds and management pathways must be
          checked against your local formulary and current guidelines. This atlas is not a clinical
          decision-support tool.
        </div>
      </div>
    </div>
  )
}

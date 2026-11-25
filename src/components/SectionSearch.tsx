import { useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { searchAll, sectionLabel, type SearchItem, type SectionId } from '../data'

export default function SectionSearch({ section }: { section: SectionId }) {
  const [query, setQuery] = useState('')
  const results = useMemo(
    () => searchAll(query, 10).filter((item: SearchItem) => item.section === section),
    [query, section],
  )

  if (query.trim() === '') {
    return (
      <label className="section-search">
        <Search size={15} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${sectionLabel[section]}…`} />
        <span className="sr-only">Search this section</span>
      </label>
    )
  }

  return (
    <div className="section-search section-search-active">
      <Search size={15} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${sectionLabel[section]}…`} aria-label="Search" />
      <div className="section-results">
        {results.length === 0 ? (
          <span className="section-results-empty">Nothing in this section yet. Try a broader search in the global palette.</span>
        ) : (
          results.map((item) => (
            <a key={item.id} href={item.href} className="section-result">
              <span>
                <strong>{item.name}</strong>
                <small>{item.subtitle}</small>
              </span>
              <ArrowRight size={12} />
            </a>
          ))
        )}
      </div>
    </div>
  )
}

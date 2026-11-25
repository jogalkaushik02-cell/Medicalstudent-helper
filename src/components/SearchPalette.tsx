import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  CornerDownLeft,
  FlaskConical,
  Layers,
  LayoutGrid,
  Search,
  Stethoscope,
  Waypoints,
} from 'lucide-react'
import { searchAll, type SearchItem } from '../data'

const kindLabel: Record<SearchItem['kind'], string> = {
  section: 'Portals',
  structure: 'Structures',
  disease: 'Diseases',
  pathway: 'Pathways',
  simulation: 'Simulations',
  case: 'Clinical cases',
}

const kindOrder: SearchItem['kind'][] = ['section', 'structure', 'disease', 'pathway', 'simulation', 'case']

const kindIcon = {
  section: LayoutGrid,
  structure: Layers,
  disease: Stethoscope,
  pathway: Waypoints,
  simulation: FlaskConical,
  case: ClipboardList,
}

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const navigate = useNavigate()

  const results = useMemo(() => searchAll(query), [query])

  const groups = useMemo(
    () =>
      kindOrder
        .map((kind) => ({ kind, items: results.filter((item) => item.kind === kind) }))
        .filter((group) => group.items.length > 0),
    [results],
  )

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement | null
    setQuery('')
    setActive(0)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      window.clearTimeout(timer)
      restoreRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (active >= results.length) {
      setActive(Math.max(0, results.length - 1))
    }
  }, [active, results.length])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActive((current) => Math.min(current + 1, Math.max(0, results.length - 1)))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActive((current) => Math.max(0, current - 1))
      } else if (event.key === 'Enter') {
        const item = results[active]
        if (item) {
          event.preventDefault()
          navigate(item.href)
          onClose()
        }
      } else if (event.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, active, navigate, onClose])

  if (!open) return null

  const choose = (item: SearchItem) => {
    navigate(item.href)
    onClose()
  }

  return (
    <div
      className="search-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search SENSE Atlas"
      >
        <div className="search-input-row">
          <Search size={18} />
          <input
            ref={inputRef}
            className="search-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            placeholder="Search structures, diseases, pathways, cases…"
            aria-label="Search"
          />
          <span className="search-esc">ESC</span>
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">
              No results for “{query}”.
              <div style={{ marginTop: 6 }}>Try “stapes”, “glaucoma”, “visual field”, or “Bell”.</div>
            </div>
          ) : (
            groups.map((group) => {
              const Icon = kindIcon[group.kind]
              return (
                <div key={group.kind}>
                  <div className="search-group-label">{kindLabel[group.kind]}</div>
                  {group.items.map((item) => {
                    const index = results.findIndex((result) => result.id === item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`search-item${index === active ? ' active' : ''}`}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => choose(item)}
                      >
                        <span className="search-icon">
                          <Icon size={14} />
                        </span>
                        <span className="search-item-main">
                          <span className="search-item-title">{item.name}</span>
                          <span className="search-item-sub">{item.subtitle}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        <div className="search-foot">
          <span>
            <CornerDownLeft size={11} /> open
          </span>
          <span>↑↓ navigate</span>
          <span>esc close</span>
          <span style={{ marginLeft: 'auto' }}>{results.length} results</span>
        </div>
      </div>
    </div>
  )
}

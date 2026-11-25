import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { useSearchOpen } from '../components/search-context'

export default function NotFound() {
  const openSearch = useSearchOpen()

  return (
    <div className="page">
      <div className="notfound">
        <div className="eyebrow">404 · not found</div>
        <h1>That page is not in the atlas</h1>
        <p className="muted">
          The link may be outdated, or the structure, disease or case ID may have changed. Search the
          atlas or return to the overview.
        </p>
        <div className="row wrap" style={{ gap: 8, marginTop: 18 }}>
          <button type="button" className="btn btn-primary" onClick={openSearch}>
            <Search size={14} /> Search the atlas
          </button>
          <Link to="/" className="btn">
            <ArrowLeft size={14} /> Back to overview
          </Link>
        </div>
      </div>
    </div>
  )
}

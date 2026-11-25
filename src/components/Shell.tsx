import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BookOpen,
  ClipboardList,
  Ear,
  Eye,
  FlaskConical,
  Home,
  Info,
  LayoutGrid,
  Megaphone,
  Search,
  ShieldAlert,
  Speech,
  Stethoscope,
  ScanLine,
  Waypoints,
} from 'lucide-react'
import { SearchOpenContext } from './search-context'
import SearchPalette from './SearchPalette'

const exploreNav = [
  { to: '/', label: 'Overview', icon: Home, end: true },
  { to: '/sections', label: 'Sections', icon: LayoutGrid },
  { to: '/ear', label: 'Ear', icon: Ear },
  { to: '/eye', label: 'Eye', icon: Eye },
  { to: '/pathways', label: 'Pathways', icon: Waypoints },
]

const portalNav = [
  { to: '/nose', label: 'Nose', icon: ScanLine },
  { to: '/pharynx', label: 'Pharynx', icon: Speech },
  { to: '/larynx', label: 'Larynx', icon: Megaphone },
]

const learnNav = [
  { to: '/diseases', label: 'Diseases', icon: Stethoscope },
  { to: '/simulations', label: 'Simulations', icon: FlaskConical },
  { to: '/cases', label: 'Clinical cases', icon: ClipboardList },
]

const referenceNav = [{ to: '/about', label: 'Accuracy & limits', icon: Info }]

function titleFor(pathname: string) {
  if (pathname === '/') return 'Overview'
  if (pathname === '/sections') return 'Sections'
  if (pathname === '/ear') return 'Ear explorer'
  if (pathname === '/eye') return 'Eye explorer'
  if (['/nose', '/pharynx', '/larynx'].includes(pathname)) return 'Portal — Section'
  if (pathname === '/pathways') return 'Pathways'
  if (pathname.startsWith('/pathways/')) return 'Pathway detail'
  if (pathname === '/diseases') return 'Diseases'
  if (pathname.startsWith('/diseases/')) return 'Disease detail'
  if (pathname === '/simulations') return 'Simulations'
  if (pathname === '/cases') return 'Clinical cases'
  if (pathname === '/about') return 'Accuracy & limitations'
  return 'SENSE Atlas'
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <div className="brand-mark">S</div>
        <div>
          <div className="brand-name">SENSE</div>
          <div className="brand-sub">ENT · OPHTHALMOLOGY</div>
        </div>
      </NavLink>

      <div className="nav-section">
        <div className="nav-label">Explore</div>
        {exploreNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={15} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-label">Portals</div>
        {portalNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={15} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-label">Learn</div>
        {learnNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={15} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-label">Reference</div>
        {referenceNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={15} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-foot">
        <div className="row" style={{ marginBottom: 6 }}>
          <BookOpen size={12} />
          <strong>Preview v0.1</strong>
        </div>
        Schematic 3D · sourced content · known limitations.
        <div style={{ marginTop: 6 }}>
          <NavLink to="/about" style={{ color: 'var(--teal)' }}>
            Not for clinical use →
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ onSearch }: { onSearch: () => void }) {
  const { pathname } = useLocation()
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-crumb">
          <span>SENSE</span> / {titleFor(pathname)}
        </div>
      </div>
      <div className="topbar-spacer" />
      <button className="search-trigger" type="button" onClick={onSearch}>
        <Search size={14} />
        <span>Search anatomy, disease, pathway…</span>
        <span className="kbd">⌘K</span>
      </button>
      <div className="topbar-actions">
        <NavLink to="/about" className="icon-btn" aria-label="Accuracy and limitations">
          <ShieldAlert size={15} />
        </NavLink>
      </div>
    </header>
  )
}

function BottomNav() {
  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/sections', label: 'Sections', icon: LayoutGrid },
    { to: '/ear', label: 'Ear', icon: Ear },
    { to: '/eye', label: 'Eye', icon: Eye },
    { to: '/cases', label: 'Cases', icon: ClipboardList },
  ]
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <item.icon size={17} strokeWidth={1.8} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-left">
        <strong>SENSE Atlas</strong> — Created by Kaushik Jogal · AI build partner DeepSeek V4.1 Flash Free
      </div>
      <div className="site-footer-right">
        <a className="cta-link external" href="https://wa.me/9193163904" target="_blank" rel="noreferrer">
          Suggest on WhatsApp
        </a>
        <a className="cta-link external" href="https://www.edx.org" target="_blank" rel="noreferrer">
          External references (EDx and similar)
        </a>
        <Link to="/about" className="cta-link">
          Limits & accuracy
        </Link>
      </div>
    </footer>
  )
}

export default function Shell() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <SearchOpenContext.Provider value={() => setSearchOpen(true)}>
      <ScrollToTop />
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <Topbar onSearch={() => setSearchOpen(true)} />
          <main>
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <BottomNav />
      </div>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </SearchOpenContext.Provider>
  )
}

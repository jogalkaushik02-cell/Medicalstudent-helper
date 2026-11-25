import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Home from './pages/Home'
import Sections from './pages/Sections'
import SectionPage from './pages/SectionPage'
import NotFound from './pages/NotFound'

const EarExplorer = lazy(() => import('./pages/EarExplorer'))
const EyeExplorer = lazy(() => import('./pages/EyeExplorer'))
const Pathways = lazy(() => import('./pages/Pathways'))
const PathwayDetail = lazy(() => import('./pages/PathwayDetail'))
const Diseases = lazy(() => import('./pages/Diseases'))
const DiseaseDetail = lazy(() => import('./pages/DiseaseDetail'))
const Simulations = lazy(() => import('./pages/Simulations'))
const Cases = lazy(() => import('./pages/Cases'))
const About = lazy(() => import('./pages/About'))

function PageLoading() {
  return (
    <div className="page">
      <div className="search-empty" role="status" aria-live="polite">
        Loading atlas…
      </div>
    </div>
  )
}

/**
 * Suspense sits below the Shell layout, so lazy route chunks never unmount the
 * sidebar, top bar or mobile navigation while they load.
 */
const page = (node: ReactNode) => <Suspense fallback={<PageLoading />}>{node}</Suspense>

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="sections" element={page(<Sections />)} />
          <Route path="nose" element={page(<SectionPage sectionId="nose" />)} />
          <Route path="pharynx" element={page(<SectionPage sectionId="pharynx" />)} />
          <Route path="larynx" element={page(<SectionPage sectionId="larynx" />)} />
          <Route path="ear" element={page(<EarExplorer />)} />
          <Route path="eye" element={page(<EyeExplorer />)} />
          <Route path="pathways" element={page(<Pathways />)} />
          <Route path="pathways/:id" element={page(<PathwayDetail />)} />
          <Route path="diseases" element={page(<Diseases />)} />
          <Route path="diseases/:id" element={page(<DiseaseDetail />)} />
          <Route path="simulations" element={page(<Simulations />)} />
          <Route path="cases" element={page(<Cases />)} />
          <Route path="about" element={page(<About />)} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

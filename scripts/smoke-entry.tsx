import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Shell from '../src/components/Shell'
import Home from '../src/pages/Home'
import EarExplorer from '../src/pages/EarExplorer'
import EyeExplorer from '../src/pages/EyeExplorer'
import Pathways from '../src/pages/Pathways'
import PathwayDetail from '../src/pages/PathwayDetail'
import Diseases from '../src/pages/Diseases'
import DiseaseDetail from '../src/pages/DiseaseDetail'
import Simulations from '../src/pages/Simulations'
import Cases from '../src/pages/Cases'
import About from '../src/pages/About'
import NotFound from '../src/pages/NotFound'

const routes = [
  '/',
  '/',
  '/sections',
  '/nose',
  '/nose?select=septum',
  '/pharynx',
  '/pharynx?select=epiglottis',
  '/larynx',
  '/larynx?select=trachea',
  '/ear',
  '/ear?select=cochlea&overlay=aom',
  '/eye',
  '/eye?select=cornea&cataract=70',
  '/pathways',
  '/pathways/visual',
  '/pathways/auditory',
  '/pathways/facial',
  '/pathways/pupillary',
  '/diseases',
  '/diseases?system=ent',
  '/diseases?system=ophtho',
  '/simulations',
  '/cases',
  '/cases?case=case-meniere',
  '/about',
  '/does-not-exist',
]

let failed = 0
for (const url of routes) {
  try {
    const html = renderToString(
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<Home />} />
              <Route path="ear" element={<EarExplorer />} />
              <Route path="eye" element={<EyeExplorer />} />
              <Route path="pathways" element={<Pathways />} />
              <Route path="pathways/:id" element={<PathwayDetail />} />
              <Route path="diseases" element={<Diseases />} />
              <Route path="diseases/:id" element={<DiseaseDetail />} />
              <Route path="simulations" element={<Simulations />} />
              <Route path="cases" element={<Cases />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </MemoryRouter>
    )
    if (html.length < 500) throw new Error(`suspiciously short output (${html.length} chars)`)
    console.log(`ok   ${url} (${html.length} chars)`)
  } catch (error) {
    failed += 1
    console.error(`FAIL ${url}`)
    console.error(error instanceof Error ? error.stack : error)
  }
}

// Every disease and pathway detail page must render, not just the sampled ones.
const { diseases, pathways, clinicalCases } = await import('../src/data/index')
for (const disease of diseases) {
  try {
    renderToString(
      <MemoryRouter initialEntries={[`/diseases/${disease.id}`]}>
        <Routes>
          <Route path="diseases/:id" element={<DiseaseDetail />} />
        </Routes>
      </MemoryRouter>,
    )
  } catch (error) {
    failed += 1
    console.error(`FAIL /diseases/${disease.id}`)
    console.error(error instanceof Error ? error.stack : error)
  }
}
for (const pathway of pathways) {
  try {
    renderToString(
      <MemoryRouter initialEntries={[`/pathways/${pathway.id}`]}>
        <Routes>
          <Route path="pathways/:id" element={<PathwayDetail />} />
        </Routes>
      </MemoryRouter>,
    )
  } catch (error) {
    failed += 1
    console.error(`FAIL /pathways/${pathway.id}`)
    console.error(error instanceof Error ? error.stack : error)
  }
}
for (const item of clinicalCases) {
  try {
    renderToString(
      <MemoryRouter initialEntries={[`/cases?case=${item.id}`]}>
        <Routes>
          <Route path="cases" element={<Cases />} />
        </Routes>
      </MemoryRouter>,
    )
  } catch (error) {
    failed += 1
    console.error(`FAIL /cases?case=${item.id}`)
    console.error(error instanceof Error ? error.stack : error)
  }
}

if (failed > 0) {
  console.error(`\n${failed} route(s) failed to render`)
  process.exit(1)
}
console.log(`\nAll ${routes.length} routes and ${diseases.length} diseases, ${pathways.length} pathways, ${clinicalCases.length} cases rendered.`)

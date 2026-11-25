import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Box, Layers, RotateCcw, Tag, Volume2 } from 'lucide-react'
import EarScene, { type EarLayers, type EarOverlay } from '../scenes/EarScene'
import SceneBoundary from '../components/SceneBoundary'
import StructureDetail from '../components/StructureDetail'
import { diseasesById, earStructures } from '../data'
import { Badge, SystemBadge } from '../components/ui'

const REGIONS = ['Outer ear', 'Middle ear', 'Inner ear', 'Nerves & pathways']

const OVERLAYS: { id: EarOverlay; label: string; diseaseId?: string }[] = [
  { id: 'normal', label: 'Normal anatomy' },
  { id: 'aom', label: 'Acute otitis media', diseaseId: 'acute-otitis-media' },
  { id: 'otitis-externa', label: 'Otitis externa', diseaseId: 'otitis-externa' },
  { id: 'cholesteatoma', label: 'Cholesteatoma', diseaseId: 'cholesteatoma' },
  { id: 'otosclerosis', label: 'Otosclerosis', diseaseId: 'otosclerosis' },
  { id: 'schwannoma', label: 'Vestibular schwannoma', diseaseId: 'acoustic-neuroma' },
]

const LAYER_DEFS: { key: keyof EarLayers; label: string }[] = [
  { key: 'outer', label: 'Outer' },
  { key: 'middle', label: 'Middle' },
  { key: 'inner', label: 'Inner' },
  { key: 'nerves', label: 'Nerves' },
]

export default function EarExplorer() {
  const [params, setParams] = useSearchParams()
  const selectParam = params.get('select')
  const overlayParam = params.get('overlay')

  const [selected, setSelected] = useState<string | null>(() =>
    selectParam && earStructures.some((item) => item.id === selectParam) ? selectParam : null,
  )
  const [overlay, setOverlay] = useState<EarOverlay>(() =>
    OVERLAYS.some((item) => item.id === overlayParam) ? (overlayParam as EarOverlay) : 'normal',
  )
  const [layers, setLayers] = useState<EarLayers>({
    outer: true,
    middle: true,
    inner: true,
    nerves: true,
  })
  const [labels, setLabels] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (selectParam && earStructures.some((item) => item.id === selectParam)) {
      setSelected(selectParam)
    }
    if (!selectParam) setSelected(null)
  }, [selectParam])

  useEffect(() => {
    if (overlayParam && OVERLAYS.some((item) => item.id === overlayParam)) {
      setOverlay(overlayParam as EarOverlay)
    }
  }, [overlayParam])

  const selectStructure = (id: string | null) => {
    setSelected(id)
    const next = new URLSearchParams(params)
    if (id) next.set('select', id)
    else next.delete('select')
    setParams(next, { replace: true })
  }

  const changeOverlay = (value: EarOverlay) => {
    setOverlay(value)
    const nextLayers = { ...layers }
    if (value === 'aom' || value === 'cholesteatoma' || value === 'otosclerosis') {
      nextLayers.outer = true
      nextLayers.middle = true
    }
    if (value === 'otitis-externa') nextLayers.outer = true
    if (value === 'schwannoma') {
      nextLayers.inner = true
      nextLayers.nerves = true
    }
    setLayers(nextLayers)

    const next = new URLSearchParams(params)
    if (value === 'normal') next.delete('overlay')
    else next.set('overlay', value)
    setParams(next, { replace: true })
  }

  const toggleLayer = (key: keyof EarLayers) => {
    setLayers((current) => ({ ...current, [key]: !current[key] }))
  }

  const overlayInfo = OVERLAYS.find((item) => item.id === overlay)
  const overlayDisease = overlayInfo?.diseaseId ? diseasesById[overlayInfo.diseaseId] : null
  const selectedStructure = selected ? earStructures.find((item) => item.id === selected) : null

  return (
    <div className="explorer-page">
      <header className="explorer-head">
        <div>
          <div className="eyebrow">Interactive 3D · schematic</div>
          <h1>Ear explorer</h1>
          <p>Outer, middle and inner ear with the ossicular chain, facial nerve and labyrinth.</p>
        </div>
        <div className="explorer-head-actions">
          <Link to="/diseases?system=ent" className="btn btn-sm">
            ENT diseases
          </Link>
          <Link to="/pathways/auditory" className="btn btn-sm">
            Auditory pathway
          </Link>
          <Link to="/simulations#audiogram" className="btn btn-sm btn-primary">
            Audiogram
          </Link>
        </div>
      </header>

      <div className="explorer-grid">
        <aside className="structure-rail" aria-label="Ear structures">
          {REGIONS.map((region) => (
            <div key={region} className="rail-group">
              <div className="rail-label">{region}</div>
              {earStructures
                .filter((item) => item.region === region)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`rail-item${selected === item.id ? ' active' : ''}${item.mesh ? '' : ' no-mesh'}`}
                    onClick={() => selectStructure(item.id)}
                    aria-pressed={selected === item.id}
                  >
                    <span className="mesh-dot" aria-hidden="true" />
                    {item.name}
                  </button>
                ))}
            </div>
          ))}
        </aside>

        <div className="viewer">
          <div className="viewer-toolbar">
            <div className="tool-group" role="group" aria-label="Anatomy layers">
              {LAYER_DEFS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`tool-btn${layers[item.key] ? ' on' : ''}`}
                  onClick={() => toggleLayer(item.key)}
                  aria-pressed={layers[item.key]}
                >
                  <Layers size={11} /> {item.label}
                </button>
              ))}
            </div>

            <label className="sr-only" htmlFor="ear-overlay">
              Disease overlay
            </label>
            <select
              id="ear-overlay"
              className="tool-select"
              value={overlay}
              onChange={(event) => changeOverlay(event.target.value as EarOverlay)}
            >
              {OVERLAYS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>

            <div className="tool-group" role="group" aria-label="Display options">
              <button
                type="button"
                className={`tool-btn${labels ? ' on' : ''}`}
                onClick={() => setLabels((value) => !value)}
                aria-pressed={labels}
              >
                <Tag size={11} /> Labels
              </button>
              <button
                type="button"
                className={`tool-btn${pulse ? ' on' : ''}`}
                onClick={() => setPulse((value) => !value)}
                aria-pressed={pulse}
              >
                <Volume2 size={11} /> Sound path
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={() => setResetKey((value) => value + 1)}
                aria-label="Reset 3D view"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          </div>

          <div className="canvas-wrap">
            <SceneBoundary>
              <EarScene
                selected={selected}
                onSelect={selectStructure}
                layers={layers}
                overlay={overlay}
                labels={labels}
                pulse={pulse}
                resetKey={resetKey}
              />
            </SceneBoundary>
            <div className="viewer-badge">
              <Box size={10} /> Schematic · not to scale
            </div>

            {overlayDisease && (
              <div className="viewer-overlay-note">
                <div>
                  <span className="badge badge-warn">{overlayInfo?.label}</span>
                  <Link to={`/diseases/${overlayDisease.id}`} className="overlay-link">
                    Read the disease →
                  </Link>
                </div>
              </div>
            )}

            <div className="legend" aria-hidden="true">
              <span>
                <span className="legend-dot" style={{ background: '#e8b49a' }} /> Soft tissue
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#efe3c8' }} /> Bone / ossicles
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#2dd4bf' }} /> Membranous labyrinth
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#f6c453' }} /> Nerves
              </span>
            </div>
          </div>

          <div className="viewer-foot">
            <span>{selectedStructure ? `Selected: ${selectedStructure.name}` : 'Select a structure in the model or rail'}</span>
            <span>Drag to orbit · scroll to zoom · right-drag to pan</span>
          </div>
        </div>

        <StructureDetail id={selected} />
      </div>
    </div>
  )
}

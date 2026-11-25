import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Box, Layers, RotateCcw, Tag } from 'lucide-react'
import EyeScene, { type EyeLayers } from '../scenes/EyeScene'
import SceneBoundary from '../components/SceneBoundary'
import StructureDetail from '../components/StructureDetail'
import { eyeStructures } from '../data'

const REGIONS = ['Orbit & adnexa', 'Anterior segment', 'Posterior segment', 'Neuro-ophthalmology']

const LAYER_DEFS: { key: keyof EyeLayers; label: string }[] = [
  { key: 'globe', label: 'Globe' },
  { key: 'anterior', label: 'Anterior' },
  { key: 'retina', label: 'Retina' },
  { key: 'muscles', label: 'Muscles' },
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function EyeExplorer() {
  const [params, setParams] = useSearchParams()
  const selectParam = params.get('select')
  const cataractParam = params.get('cataract')

  const [selected, setSelected] = useState<string | null>(() =>
    selectParam && eyeStructures.some((item) => item.id === selectParam) ? selectParam : null,
  )
  const [layers, setLayers] = useState<EyeLayers>({
    globe: true,
    anterior: true,
    retina: true,
    muscles: true,
  })
  const [labels, setLabels] = useState(false)
  const [cutaway, setCutaway] = useState(false)
  const [cataract, setCataract] = useState(() => {
    const value = Number(cataractParam ?? 0)
    return Number.isFinite(value) ? clamp(value, 0, 100) : 0
  })
  const [pupil, setPupil] = useState(1)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (selectParam && eyeStructures.some((item) => item.id === selectParam)) {
      setSelected(selectParam)
    }
    if (!selectParam) setSelected(null)
  }, [selectParam])

  useEffect(() => {
    if (cataractParam === null) return
    const value = Number(cataractParam)
    if (Number.isFinite(value)) setCataract(clamp(value, 0, 100))
  }, [cataractParam])

  const selectStructure = (id: string | null) => {
    setSelected(id)
    const next = new URLSearchParams(params)
    if (id) next.set('select', id)
    else next.delete('select')
    setParams(next, { replace: true })
  }

  const toggleLayer = (key: keyof EyeLayers) => {
    setLayers((current) => ({ ...current, [key]: !current[key] }))
  }

  const selectedStructure = selected ? eyeStructures.find((item) => item.id === selected) : null

  return (
    <div className="explorer-page">
      <header className="explorer-head">
        <div>
          <div className="eyebrow">Interactive 3D · schematic</div>
          <h1>Eye explorer</h1>
          <p>Globe, anterior segment, retina and optic nerve, with lens-opacity and pupil controls.</p>
        </div>
        <div className="explorer-head-actions">
          <Link to="/diseases?system=ophtho" className="btn btn-sm">
            Eye diseases
          </Link>
          <Link to="/pathways/visual" className="btn btn-sm">
            Visual pathway
          </Link>
          <Link to="/simulations#cataract" className="btn btn-sm btn-primary">
            Cataract simulator
          </Link>
        </div>
      </header>

      <div className="explorer-grid">
        <aside className="structure-rail" aria-label="Eye structures">
          {REGIONS.map((region) => (
            <div key={region} className="rail-group">
              <div className="rail-label">{region}</div>
              {eyeStructures
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
                className={`tool-btn${cutaway ? ' on' : ''}`}
                onClick={() => setCutaway((value) => !value)}
                aria-pressed={cutaway}
              >
                Cutaway
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

          <div className="viewer-controls">
            <label className="slider-control">
              <span>
                Lens opacity <span className="mono">{cataract}%</span>
              </span>
              <input
                className="range"
                type="range"
                min={0}
                max={100}
                step={5}
                value={cataract}
                onChange={(event) => setCataract(Number(event.target.value))}
              />
            </label>
            <label className="slider-control">
              <span>
                Pupil size <span className="mono">{pupil.toFixed(2)}×</span>
              </span>
              <input
                className="range"
                type="range"
                min={0.55}
                max={1.7}
                step={0.05}
                value={pupil}
                onChange={(event) => setPupil(Number(event.target.value))}
              />
            </label>
            <div className="row wrap" style={{ gap: 5 }}>
              <button type="button" className="btn btn-sm" onClick={() => { setCataract(0); setPupil(1) }}>
                Normal
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setCataract(70)}>
                Cataract +70
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setPupil(0.55)}>
                Constricted
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setPupil(1.7)}>
                Dilated
              </button>
            </div>
          </div>

          <div className="canvas-wrap">
            <SceneBoundary>
              <EyeScene
                selected={selected}
                onSelect={selectStructure}
                layers={layers}
                cataract={cataract}
                pupil={pupil}
                labels={labels}
                cutaway={cutaway}
                resetKey={resetKey}
              />
            </SceneBoundary>
            <div className="viewer-badge">
              <Box size={10} /> Schematic · not to scale
            </div>

            {cataract >= 50 && (
              <div className="viewer-overlay-note">
                <div>
                  <span className="badge badge-warn">Lens opacity {cataract}%</span>
                  <Link to="/simulations#cataract" className="overlay-link">
                    Compare the patient view →
                  </Link>
                </div>
              </div>
            )}

            <div className="legend" aria-hidden="true">
              <span>
                <span className="legend-dot" style={{ background: '#eef3f9' }} /> Sclera
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#6f8fd8' }} /> Iris
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#dff2ff' }} /> Lens
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#b5483f' }} /> Retina
              </span>
              <span>
                <span className="legend-dot" style={{ background: '#f6c453' }} /> Optic nerve
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

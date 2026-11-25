import { Link } from 'react-router-dom'
import { ArrowUpRight, Box, Stethoscope, Waypoints } from 'lucide-react'
import { diseasesForStructure, pathways, structuresById } from '../data'
import { Badge, SystemBadge } from './ui'

export default function StructureDetail({ id }: { id: string | null }) {
  if (!id) return <ExplorerIntro />

  const structure = structuresById[id]
  if (!structure) return <ExplorerIntro />

  const relatedDiseases = diseasesForStructure(structure.id)
  const relatedPathways = pathways.filter((pathway) => pathway.structures.includes(structure.id))

  return (
    <aside className="detail-panel" aria-label="Structure detail">
      <div className="detail-head">
        <SystemBadge system={structure.system} />
        <Badge tone={structure.mesh ? 'ok' : 'warn'}>
          {structure.mesh ? '3D mesh' : 'Not modelled'}
        </Badge>
        <Badge>{structure.region}</Badge>
      </div>

      <h2>{structure.name}</h2>
      {structure.latin && <div className="detail-latin">{structure.latin}</div>}
      <p className="detail-tagline">{structure.tagline}</p>
      <p className="small muted" style={{ lineHeight: 1.65 }}>
        {structure.summary}
      </p>

      {structure.dimensions && (
        <div className="dim-box" style={{ marginTop: 12 }}>
          <strong style={{ color: 'var(--text)' }}>Teaching dimensions · </strong>
          {structure.dimensions}
        </div>
      )}

      {!structure.mesh && (
        <div className="no-mesh-note" style={{ marginTop: 12 }}>
          <Box size={14} style={{ flex: '0 0 auto', marginTop: 1 }} />
          <span>
            This structure is described in the atlas but is not separately modelled in the current
            schematic scene. It can still be selected from the rail and searched globally.
          </span>
        </div>
      )}

      <div className="detail-section">
        <h3>Function</h3>
        <ul>
          {structure.function.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h3>Relations & surrounding structures</h3>
        <ul>
          {structure.relations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h3>Clinical relevance</h3>
        <ul>
          {structure.clinical.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {relatedDiseases.length > 0 && (
        <div className="detail-section">
          <h3>Diseases affecting this structure</h3>
          <div className="linked-list">
            {relatedDiseases.map((disease) => (
              <Link key={disease.id} to={`/diseases/${disease.id}`} className="linked-item">
                <span>
                  <Stethoscope size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                  {disease.name}
                </span>
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedPathways.length > 0 && (
        <div className="detail-section">
          <h3>Pathways</h3>
          <div className="linked-list">
            {relatedPathways.map((pathway) => (
              <Link key={pathway.id} to={`/pathways/${pathway.id}`} className="linked-item">
                <span>
                  <Waypoints size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
                  {pathway.name}
                </span>
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3>Tags</h3>
        <div className="structure-chips">
          {structure.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

function ExplorerIntro() {
  return (
    <aside className="detail-panel" aria-label="Explorer help">
      <div className="eyebrow">Interactive anatomy</div>
      <h2>Explore the model</h2>
      <p className="detail-tagline">
        Click a labelled structure in the 3D scene, or choose one from the structure rail. Each entry
        includes function, surrounding relations, clinical relevance and links to diseases and
        pathways.
      </p>

      <div className="detail-section">
        <h3>How to use the explorer</h3>
        <ul>
          <li>Drag to orbit, scroll or pinch to zoom, right-drag to pan.</li>
          <li>Use the layer buttons to isolate outer, middle, inner or nerve anatomy.</li>
          <li>Turn on labels when you want names anchored to the model.</li>
          <li>Choose a disease overlay to see the relevant change in context.</li>
          <li>Search from anywhere with the top search bar or ⌘K / Ctrl-K.</li>
        </ul>
      </div>

      <div className="detail-section">
        <h3>Model status</h3>
        <div className="no-mesh-note">
          <Box size={14} style={{ flex: '0 0 auto', marginTop: 1 }} />
          <span>
            The 3D models are hand-built teaching schematics. They are not scan-derived, not to
            scale, and not suitable for surgical planning. See Accuracy &amp; limits.
          </span>
        </div>
      </div>

      <div className="detail-section">
        <h3>Start with</h3>
        <div className="linked-list">
          <Link to="/diseases" className="linked-item">
            <span>Browse all diseases</span>
            <ArrowUpRight size={12} />
          </Link>
          <Link to="/pathways" className="linked-item">
            <span>Trace a pathway</span>
            <ArrowUpRight size={12} />
          </Link>
          <Link to="/simulations" className="linked-item">
            <span>Open a simulator</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </aside>
  )
}

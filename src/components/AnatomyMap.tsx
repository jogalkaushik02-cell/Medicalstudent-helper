import { useState, type MouseEvent } from 'react'
import { portals, type Portal } from '../data'

interface RegionShape {
  d: string
  x: number
  y: number
}

interface MapShapes {
  outline: string
  regions: Record<string, RegionShape>
}

const fills: Record<Portal['accent'], string> = {
  emerald: 'rgba(52,211,153,0.10)',
  lime: 'rgba(162,255,61,0.12)',
  gold: 'rgba(251,191,36,0.12)',
  violet: 'rgba(167,139,250,0.12)',
  cyan: 'rgba(52,230,242,0.10)',
}

const strokes: Record<Portal['accent'], string> = {
  emerald: '#34d399',
  lime: '#a2ff3d',
  gold: '#fbbf24',
  violet: '#a855f7',
  cyan: '#0fa5e9',
}

interface RegionButtonProps {
  shape: RegionShape
  active: boolean
  accent: string
  group: string
  onClick: () => void
  onEnter: () => void
  onLeave: () => void
}

function RegionButton({ shape, active, accent, group, onClick, onEnter, onLeave }: RegionButtonProps) {
  return (
    <g
      className={`region${active ? ' region-active' : ''}`}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={-1}
    >
      <path d={shape.d} fill={group} stroke={accent} strokeWidth={active ? 2.4 : 1.2} />
      <text x={shape.x} y={shape.y} className="region-label">
        {active ? '✓ ' : ''}
      </text>
    </g>
  )
}

export default function AnatomyMap({ portal, selected, setSelected }: { portal: Portal; selected: string; setSelected: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const shapes = MAP_SHAPES[portal.id]
  const accent = strokes[portal.accent]
  const group = fills[portal.accent]

  return (
    <svg
      viewBox="0 0 320 280"
      className="anatomy-map"
      role="img"
      aria-label={`${portal.name} anatomy map — click a labelled region`}
      onMouseLeave={() => setHovered(null)}
    >
      <path d={shapes.outline} fill="none" stroke="rgba(167,139,250,0.55)" strokeWidth="2.2" />
      {portal.regions.map((region) => {
        const shape = shapes.regions[region.id] ?? { d: '', x: 160, y: 140 }
        const active = selected === region.id
        const className = `region${active ? ' region-active' : ''}`
        return (
          <g
            key={region.id}
            className={className}
            role="button"
            aria-pressed={active}
            aria-label={region.name}
            tabIndex={-1}
            onClick={(event: MouseEvent) => {
              event.stopPropagation()
              setSelected(active ? '' : region.id)
            }}
            onMouseEnter={() => setHovered(region.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <path
              d={shape.d}
              fill={group}
              stroke={accent}
              strokeWidth={active ? 2.4 : 1.2}
              className="region-path"
            />
            <text x={shape.x} y={shape.y} className={`region-label${active ? ' region-label-active' : ''}`} fontSize="9">
              {active ? `✓ ${region.name}` : region.name}
            </text>
          </g>
        )
      })}
      {hovered && !selected && <text x="160" y="268" className="map-caption map-caption-hint">click to select</text>}
      <text x="160" y="276" textAnchor="middle" className="map-caption">
        {portal.name} — map is schematic; anatomy may vary
      </text>
    </svg>
  )
}

export const MAP_SHAPES: Record<Portal['id'], MapShapes> = {
  nose: {
    outline:
      'M64 68 C58 106 62 152 74 182 C86 208 110 222 142 224 C174 224 196 208 208 176 C220 136 212 96 188 58 C162 26 132 20 104 54 Z',
    regions: {
      septum: {
        d: 'M154 22 152 56 146 86 138 120 134 158 132 176 128 200 134 224 142 234 110 210 90 168 100 150 118 130 142 120 126 138 112 118 150 132 166 152 154',
        x: 142, y: 60,
      },
      'little-area': { d: 'M134 196 122 208 134 214 144 208 M120 140 100 160 94 146 112 132 124 142', x: 130, y: 185 },
      'inferior-turbinate': {
        d: 'M80 118 84 138 84 168 76 180 78 206 74 220 84 226 84 218 70 58 82 44 102 46 118 54 90 80 100 112 106 116 102 110 94 96 106 76 114 84 118',
        x: 118, y: 140,
      },
      'middle-turbinate': { d: 'M124 24 134 10 150 8 162 18 164 32 138 34 110 32', x: 146, y: 22 },
      'maxillary-sinus': {
        d: 'M150 52 132 56 120 88 106 104 90 150 88 168 96 200 108 196 140 158 166 150 168 146 146 156 158 140 140 108 118 88 100 92 72 82 62 66 68 90 72 100 88 72 74 50 64 50 60 80 62 80 70 76 78 74 66 90 84 100 98 88 106 90 82 100 96 108 110 118 106 124 118 132 124 130 82 138 64 138 50 142 60 148 54',
        x: 118, y: 100,
      },
      'frontal-sinus': { d: 'M156 56 160 30 174 24 182 34 186 48 160 54', x: 172, y: 44 },
      'sphenoid-sinus': { d: 'M190 108 208 106 220 118 214 140 196 152 172 134', x: 198, y: 122 },
      nasopharynx: { d: 'M92 118 94 96 112 82 130 86 150 112 150 120 136 142 142 176 158 174 158 196 168 184 152 168 126 130 118 124', x: 140, y: 120 },
    },
  },
  pharynx: {
    outline:
      'M54 84 C50 114 58 144 76 168 C94 196 116 210 140 212 C164 212 182 194 194 168 C208 128 200 86 182 52 C166 34 150 32 136 44 C124 36 110 40 54 84 Z',
    regions: {
      nasopharynx: { d: 'M102 60 98 92 106 124 118 142 126 166 104 186 94 184 98 202 112 192 116 176', x: 120, y: 96 },
      adenoid: { d: 'M130 58 132 78 126 96 120 104 122 118 136 120 146 118 150 108 144 90 138 64', x: 140, y: 90 },
      oropharynx: { d: 'M100 128 94 142 100 154 114 160 132 164 148 162 158 152 164 136 156 118 148 120', x: 128, y: 132 },
      'palatine-tonsil': { d: 'M130 140 136 146 130 152 124 158 120 154 120 144 124 134', x: 132, y: 148 },
      'soft-palate': { d: 'M146 174 138 182 132 176 140 168 150 164 158 166', x: 150, y: 168 },
      hypopharynx: { d: 'M160 170 166 190 164 208 156 218 148 208 146 186', x: 156, y: 186 },
      epiglottis: { d: 'M134 204 130 216 142 226 154 220 162 202', x: 142, y: 214 },
      'retropharyngeal-space': { d: 'M158 178 158 194 164 204 170 194 168 182', x: 162, y: 186 },
    },
  },
  larynx: {
    outline:
      'M120 46 L114 86 L112 124 L116 154 L132 176 L152 182 L174 172 L186 146 L188 112 L180 46 L158 38 C144 28 132 42 120 46 Z',
    regions: {
      epiglottis: { d: 'M132 60 128 86 132 104 140 100 146 80 142 58', x: 136, y: 70 },
      'false-cords': { d: 'M120 86 132 84 140 104 138 116 128 110 120 98', x: 130, y: 94 },
      'true-cords': { d: 'M140 86 128 86 122 108 126 124 138 116 146 88', x: 132, y: 96 },
      arytenoids: { d: 'M158 110 174 108 186 118 182 136 164 148 144 128', x: 172, y: 122 },
      subglottis: { d: 'M124 140 124 130 138 124 158 128 178 126 186 134 196 142 184 148 158 148 124 138', x: 150, y: 132 },
      'thyroid-cartilage': { d: 'M134 46 132 92 146 104 166 88 164 46', x: 148, y: 56 },
      'cricothyroid-membrane': { d: 'M154 136 158 124 176 122 184 130 178 142 166 140', x: 168, y: 132 },
      trachea: { d: 'M108 150 104 172 108 188 116 198 128 204 138 200 144 190 146 178 142 160 140 148 156 140', x: 126, y: 180 },
    },
  },
  ear: {
    outline: 'M160 8 L152 20 L140 40 L132 68 L136 96 L154 118 L176 124 L196 118 L208 96 L214 68 L212 40 L206 20 L196 10 C178 2 168 8 160 8 Z',
    regions: {},
  },
  eye: {
    outline: 'M160 40 C186 44 204 58 208 76 C208 92 188 106 160 110 C132 106 112 92 110 76 C108 56 126 44 152 42 C140 40 132 36 160 40 Z',
    regions: {},
  },
}

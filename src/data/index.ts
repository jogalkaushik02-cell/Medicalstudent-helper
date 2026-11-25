import type { Disease, SearchItem, SectionId } from './types'
import { earStructures } from './ear'
import { eyeStructures } from './eye'
import { diseases } from './diseases'
import { pathways } from './pathways'
import { clinicalCases } from './cases'
import { portals, portalsById, sectionLabel } from './sections'

export type { Portal, PortalRegion } from './sections'
export * from './types'
export {
  earStructures,
  eyeStructures,
  diseases,
  pathways,
  clinicalCases,
  portals,
  portalsById,
  sectionLabel,
}

export const allStructures = [...earStructures, ...eyeStructures]

export const structuresById = Object.fromEntries(allStructures.map((s) => [s.id, s]))
export const diseasesById = Object.fromEntries(diseases.map((d) => [d.id, d]))
export const pathwaysById = Object.fromEntries(pathways.map((p) => [p.id, p]))
export const casesById = Object.fromEntries(clinicalCases.map((c) => [c.id, c]))

export const earDiseases = diseases.filter((d) => d.system === 'ent')
export const eyeDiseases = diseases.filter((d) => d.system === 'ophtho')

/** Category-based fallback keeps older entries working without rewriting all 26. */
export function sectionOfDisease(disease: Disease): SectionId {
  if (disease.section) return disease.section
  if (disease.category.startsWith('Nose')) return 'nose'
  if (disease.category.startsWith('Pharynx')) return 'pharynx'
  if (disease.category.startsWith('Larynx')) return 'larynx'
  if (disease.category.startsWith('Eye')) return 'eye'
  return 'ear'
}

export function diseasesForSection(section: SectionId) {
  return diseases.filter((disease) => sectionOfDisease(disease) === section)
}

export function casesForSection(section: SectionId) {
  return clinicalCases.filter((item) => {
    const diagnosis = diseasesById[item.diagnosisId]
    return diagnosis ? sectionOfDisease(diagnosis) === section : false
  })
}

export const simulations: SearchItem[] = [
  {
    id: 'sim-audiogram',
    name: 'Audiogram simulator',
    subtitle: 'Conductive vs sensorineural hearing loss',
    kind: 'simulation',
    system: 'ear',
    section: 'ear',
    href: '/simulations#audiogram',
    keywords: 'audiogram hearing loss conductive sensorineural rinne weber tuning fork',
  },
  {
    id: 'sim-bppv',
    name: 'BPPV / Epley simulator',
    subtitle: 'Otoconia movement and canalith repositioning',
    kind: 'simulation',
    system: 'ear',
    section: 'ear',
    href: '/simulations#bppv',
    keywords: 'vertigo dix hallpike epley posterior canal otoconia',
  },
  {
    id: 'sim-airway',
    name: 'Airway narrowing simulator',
    subtitle: 'Calibre, stridor and voice',
    kind: 'simulation',
    system: 'larynx',
    section: 'larynx',
    href: '/simulations#airway',
    keywords: 'airway stridor larynx croup vocal cord narrowing emergency',
  },
  {
    id: 'sim-glaucoma',
    name: 'Glaucoma disc simulator',
    subtitle: 'Cupping, rim loss and field defects',
    kind: 'simulation',
    system: 'eye',
    section: 'eye',
    href: '/simulations#glaucoma',
    keywords: 'glaucoma cup disc ratio optic nerve field IOP',
  },
  {
    id: 'sim-visual-field',
    name: 'Visual field lesion simulator',
    subtitle: 'Localise lesions along the visual pathway',
    kind: 'simulation',
    system: 'eye',
    section: 'eye',
    href: '/pathways/visual',
    keywords: 'visual field hemianopia quadrantanopia chiasm optic tract lesion',
  },
  {
    id: 'sim-cataract',
    name: 'Cataract vision simulator',
    subtitle: 'See through a clouding lens',
    kind: 'simulation',
    system: 'eye',
    section: 'eye',
    href: '/simulations#cataract',
    keywords: 'cataract blur glare lens opacity',
  },
]

export const searchIndex: SearchItem[] = [
  ...portals.map<SearchItem>((portal) => ({
    id: `section-${portal.id}`,
    name: `${portal.name} portal`,
    subtitle: `Section · ${portal.kicker}`,
    kind: 'section',
    system: portal.id,
    section: portal.id,
    href: `/${portal.id}`,
    keywords: [portal.name, portal.latin, portal.kicker, portal.tagline, portal.description, portal.searchHint].join(' '),
  })),
  ...allStructures.map<SearchItem>((s) => ({
    id: s.id,
    name: s.name,
    subtitle: `${s.region} · ${sectionLabel[s.system]}`,
    kind: 'structure',
    system: s.system,
    section: s.system,
    href: `/${s.system}?select=${s.id}`,
    keywords: [s.name, s.latin ?? '', s.region, s.tagline, s.summary, ...s.tags].join(' '),
  })),
  ...diseases.map<SearchItem>((d) => {
    const section = sectionOfDisease(d)
    return {
      id: d.id,
      name: d.name,
      subtitle: d.category,
      kind: 'disease',
      system: section,
      section,
      href: `/diseases/${d.id}`,
      keywords: [d.name, d.category, d.tagline, d.definition, ...d.tags, ...d.symptoms, ...d.signs].join(' '),
    }
  }),
  ...pathways.map<SearchItem>((p) => ({
    id: p.id,
    name: p.name,
    subtitle: `Pathway · ${p.system === 'ear' ? 'ENT' : 'Ophthalmology'}`,
    kind: 'pathway',
    system: p.system,
    section: p.system,
    href: `/pathways/${p.id}`,
    keywords: [p.name, p.summary, ...p.tags, ...p.steps.map((s) => s.label)].join(' '),
  })),
  ...simulations,
  ...clinicalCases.map<SearchItem>((c) => {
    const diagnosis = diseasesById[c.diagnosisId]
    const section = diagnosis ? sectionOfDisease(diagnosis) : c.system === 'ent' ? 'ear' : 'eye'
    return {
      id: c.id,
      name: c.title,
      subtitle: `Clinical case · ${sectionLabel[section]}`,
      kind: 'case',
      system: section,
      section,
      href: `/cases?case=${c.id}`,
      keywords: [c.title, c.vignette, c.question, c.pearl, c.system, section].join(' '),
    }
  }),
]

const kindRank: Record<SearchItem['kind'], number> = {
  section: 0,
  structure: 1,
  disease: 2,
  pathway: 3,
  simulation: 4,
  case: 5,
}

export function searchAll(query: string, limit = 24): SearchItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return searchIndex.slice(0, limit)
  const tokens = q.split(/\s+/).filter(Boolean)

  return searchIndex
    .map((item) => {
      const name = item.name.toLowerCase()
      const keywords = item.keywords.toLowerCase()
      const subtitle = item.subtitle.toLowerCase()
      if (!tokens.every((t) => keywords.includes(t) || name.includes(t) || subtitle.includes(t))) {
        return { item, score: -1 }
      }
      let score = 0
      if (name === q) score += 120
      if (name.startsWith(q)) score += 80
      if (name.includes(q)) score += 50
      if (subtitle.includes(q)) score += 20
      for (const t of tokens) {
        if (name.includes(t)) score += 12
        if (keywords.includes(t)) score += 4
      }
      score -= kindRank[item.kind] * 2
      return { item, score }
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item)
}

export function diseasesForStructure(structureId: string) {
  return diseases.filter((d) => d.structures.includes(structureId))
}

export function structuresForDisease(diseaseId: string) {
  const d = diseasesById[diseaseId]
  if (!d) return []
  return d.structures.map((id) => structuresById[id]).filter(Boolean)
}

export function relatedDiseases(system: 'ear' | 'eye') {
  return diseases.filter((d) => (system === 'ear' ? d.system === 'ent' : d.system === 'ophtho'))
}

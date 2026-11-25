export type SectionId = 'ear' | 'nose' | 'pharynx' | 'larynx' | 'eye'

export type System = 'ear' | 'eye'

export type SimKind =
  | 'ear-overlay'
  | 'audiogram'
  | 'bppv'
  | 'airway'
  | 'cataract'
  | 'glaucoma'
  | 'visual-field'
  | 'fundus'

export interface AnatomyNode {
  id: string
  name: string
  latin?: string
  system: System
  region: string
  tagline: string
  summary: string
  dimensions?: string
  function: string[]
  relations: string[]
  clinical: string[]
  tags: string[]
  /** true when the structure has a clickable mesh in the 3D scene */
  mesh?: boolean
}

export interface Disease {
  id: string
  name: string
  system: System | 'ent' | 'ophtho'
  /** Learning portal this condition belongs to. Derived from category when omitted. */
  section?: SectionId
  category: string
  tagline: string
  definition: string
  epidemiology?: string
  pathophysiology: string[]
  riskFactors: string[]
  symptoms: string[]
  signs: string[]
  investigations: string[]
  treatment: string[]
  complications?: string[]
  pearls: string[]
  structures: string[]
  sim?: SimKind
  tags: string[]
}

export interface PathwayStep {
  id: string
  label: string
  detail: string
  lesion?: string
}

export interface Pathway {
  id: string
  name: string
  system: System
  tagline: string
  summary: string
  steps: PathwayStep[]
  notes: string[]
  structures: string[]
  tags: string[]
}

export interface CaseOption {
  text: string
  correct?: boolean
  why: string
}

export interface ClinicalCase {
  id: string
  title: string
  system: 'ent' | 'ophtho'
  difficulty: 'Foundation' | 'Clinical' | 'Exam'
  vignette: string
  question: string
  options: CaseOption[]
  diagnosisId: string
  explanation: string[]
  pearl: string
}

export interface SearchItem {
  id: string
  name: string
  subtitle: string
  kind: 'section' | 'structure' | 'disease' | 'pathway' | 'simulation' | 'case'
  system: SectionId | 'both'
  section?: SectionId
  href: string
  keywords: string
}

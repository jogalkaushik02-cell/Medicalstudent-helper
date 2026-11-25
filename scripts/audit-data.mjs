#!/usr/bin/env node
/**
 * Data-integrity audit for SENSE Atlas.
 *
 * Bundles the TypeScript data module with esbuild, imports it, and checks every
 * cross-reference used by the UI and search index. Run with:
 *   node scripts/audit-data.mjs
 */
import { build } from 'esbuild'
import { mkdir, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'accuracy', '.audit')
const outFile = path.join(outDir, 'data.mjs')

const errors = []
const warnings = []
const fail = (message) => errors.push(message)
const warn = (message) => warnings.push(message)

await mkdir(outDir, { recursive: true })
await build({
  entryPoints: [path.join(root, 'src/data/index.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: outFile,
  logLevel: 'silent',
})

const data = await import(`${pathToFileURL(outFile).href}?t=${Date.now()}`)
const {
  allStructures,
  diseases,
  pathways,
  clinicalCases,
  searchIndex,
  simulations,
  earStructures,
  eyeStructures,
  portals,
} = data

const structureIds = new Set(allStructures.map((item) => item.id))
const diseaseIds = new Set(diseases.map((item) => item.id))
const pathwayIds = new Set(pathways.map((item) => item.id))
const caseIds = new Set(clinicalCases.map((item) => item.id))

const unique = (items, label) => {
  const seen = new Set()
  for (const item of items) {
    if (seen.has(item.id)) fail(`${label}: duplicate id "${item.id}"`)
    seen.add(item.id)
  }
}

unique(allStructures, 'structures')
unique(diseases, 'diseases')
unique(pathways, 'pathways')
unique(clinicalCases, 'cases')
unique(simulations, 'simulations')

const requiredText = (value, label) => {
  if (typeof value !== 'string' || value.trim().length === 0) fail(`${label}: missing text`)
}
const requiredList = (value, label) => {
  if (!Array.isArray(value) || value.length === 0) fail(`${label}: empty list`)
}

for (const structure of allStructures) {
  requiredText(structure.name, `structure ${structure.id}.name`)
  requiredText(structure.region, `structure ${structure.id}.region`)
  requiredText(structure.tagline, `structure ${structure.id}.tagline`)
  requiredText(structure.summary, `structure ${structure.id}.summary`)
  requiredList(structure.function, `structure ${structure.id}.function`)
  requiredList(structure.relations, `structure ${structure.id}.relations`)
  requiredList(structure.clinical, `structure ${structure.id}.clinical`)
  requiredList(structure.tags, `structure ${structure.id}.tags`)
  if (structure.system !== 'ear' && structure.system !== 'eye') {
    fail(`structure ${structure.id}: invalid system "${structure.system}"`)
  }
}

for (const disease of diseases) {
  requiredText(disease.name, `disease ${disease.id}.name`)
  requiredText(disease.definition, `disease ${disease.id}.definition`)
  requiredList(disease.pathophysiology, `disease ${disease.id}.pathophysiology`)
  requiredList(disease.riskFactors, `disease ${disease.id}.riskFactors`)
  requiredList(disease.symptoms, `disease ${disease.id}.symptoms`)
  requiredList(disease.signs, `disease ${disease.id}.signs`)
  requiredList(disease.investigations, `disease ${disease.id}.investigations`)
  requiredList(disease.treatment, `disease ${disease.id}.treatment`)
  requiredList(disease.pearls, `disease ${disease.id}.pearls`)
  requiredList(disease.tags, `disease ${disease.id}.tags`)
  if (disease.system !== 'ent' && disease.system !== 'ophtho') {
    fail(`disease ${disease.id}: invalid system "${disease.system}"`)
  }
  const validSections = new Set(['ear', 'nose', 'pharynx', 'larynx', 'eye'])
  if (disease.section && !validSections.has(disease.section)) {
    fail(`disease ${disease.id}: invalid section "${disease.section}"`)
  }
  for (const structureId of disease.structures) {
    if (!structureIds.has(structureId)) {
      fail(`disease ${disease.id}: unknown structure "${structureId}"`)
    }
  }
  if (disease.system === 'ent') {
    for (const structureId of disease.structures) {
      const structure = allStructures.find((item) => item.id === structureId)
      if (structure && structure.system !== 'ear') {
        fail(`disease ${disease.id} is ENT but references non-ear structure "${structureId}"`)
      }
    }
  }
  if (disease.system === 'ophtho') {
    for (const structureId of disease.structures) {
      const structure = allStructures.find((item) => item.id === structureId)
      if (structure && structure.system !== 'eye') {
        fail(`disease ${disease.id} is ophtho but references non-eye structure "${structureId}"`)
      }
    }
  }
  const validSims = new Set(['ear-overlay', 'audiogram', 'bppv', 'airway', 'cataract', 'glaucoma', 'visual-field', 'fundus'])
  if (disease.sim && !validSims.has(disease.sim)) {
    fail(`disease ${disease.id}: invalid sim "${disease.sim}"`)
  }
}

for (const pathway of pathways) {
  requiredText(pathway.name, `pathway ${pathway.id}.name`)
  requiredText(pathway.summary, `pathway ${pathway.id}.summary`)
  requiredList(pathway.steps, `pathway ${pathway.id}.steps`)
  requiredList(pathway.notes, `pathway ${pathway.id}.notes`)
  requiredList(pathway.tags, `pathway ${pathway.id}.tags`)
  const stepIds = new Set()
  for (const step of pathway.steps) {
    if (stepIds.has(step.id)) fail(`pathway ${pathway.id}: duplicate step id "${step.id}"`)
    stepIds.add(step.id)
    requiredText(step.label, `pathway ${pathway.id}.step.${step.id}.label`)
    requiredText(step.detail, `pathway ${pathway.id}.step.${step.id}.detail`)
  }
  for (const structureId of pathway.structures) {
    if (!structureIds.has(structureId)) {
      fail(`pathway ${pathway.id}: unknown structure "${structureId}"`)
    }
  }
  if (pathway.system === 'ear' || pathway.system === 'eye') {
    for (const structureId of pathway.structures) {
      const structure = allStructures.find((item) => item.id === structureId)
      if (structure && structure.system !== pathway.system) {
        warn(
          `pathway ${pathway.id} (${pathway.system}) references ${structure.system} structure "${structureId}" — check this is intentional`,
        )
      }
    }
  }
}

for (const item of clinicalCases) {
  requiredText(item.title, `case ${item.id}.title`)
  requiredText(item.vignette, `case ${item.id}.vignette`)
  requiredText(item.question, `case ${item.id}.question`)
  requiredText(item.pearl, `case ${item.id}.pearl`)
  requiredList(item.explanation, `case ${item.id}.explanation`)
  if (!diseaseIds.has(item.diagnosisId)) {
    fail(`case ${item.id}: unknown diagnosisId "${item.diagnosisId}"`)
  }
  const correct = item.options.filter((option) => option.correct)
  if (correct.length !== 1) {
    fail(`case ${item.id}: expected exactly one correct option, found ${correct.length}`)
  }
  for (const option of item.options) {
    requiredText(option.text, `case ${item.id}.option.text`)
    requiredText(option.why, `case ${item.id}.option.why`)
  }
}

for (const item of searchIndex) {
  if (item.kind === 'section') {
    if (!portals.some((portal) => portal.id === item.section)) {
      fail(`search ${item.id}: unknown section`)
    }
    if (item.href !== `/${item.section}`) {
      fail(`search ${item.id}: section href mismatch (${item.href})`)
    }
  } else if (item.kind === 'structure') {
    if (!structureIds.has(item.id)) fail(`search ${item.id}: unknown structure`)
    const structure = allStructures.find((entry) => entry.id === item.id)
    if (structure && item.href !== `/${structure.system}?select=${structure.id}`) {
      fail(`search ${item.id}: structure href mismatch (${item.href})`)
    }
  } else if (item.kind === 'disease') {
    if (!diseaseIds.has(item.id)) fail(`search ${item.id}: unknown disease`)
    if (item.href !== `/diseases/${item.id}`) fail(`search ${item.id}: disease href mismatch`)
  } else if (item.kind === 'pathway') {
    if (!pathwayIds.has(item.id)) fail(`search ${item.id}: unknown pathway`)
    if (item.href !== `/pathways/${item.id}`) fail(`search ${item.id}: pathway href mismatch`)
  } else if (item.kind === 'case') {
    if (!caseIds.has(item.id)) fail(`search ${item.id}: unknown case`)
    if (item.href !== `/cases?case=${item.id}`) fail(`search ${item.id}: case href mismatch`)
  } else if (item.kind === 'simulation') {
    if (!item.href.startsWith('/simulations') && !item.href.startsWith('/pathways/') && !item.href.startsWith('/eye') && !item.href.startsWith('/ear')) {
      fail(`search ${item.id}: unexpected simulation href (${item.href})`)
    }
  } else {
    fail(`search ${item.id}: unknown kind "${item.kind}"`)
  }
}

for (const structure of earStructures) {
  if (structure.system !== 'ear') fail(`earStructures contains ${structure.id} with system ${structure.system}`)
}
for (const structure of eyeStructures) {
  if (structure.system !== 'eye') fail(`eyeStructures contains ${structure.id} with system ${structure.system}`)
}

const summary = [
  `structures: ${allStructures.length} (ear ${earStructures.length}, eye ${eyeStructures.length})`,
  `diseases: ${diseases.length} (ent ${diseases.filter((item) => item.system === 'ent').length}, ophtho ${diseases.filter((item) => item.system === 'ophtho').length})`,
  `pathways: ${pathways.length}`,
  `cases: ${clinicalCases.length}`,
  `search entries: ${searchIndex.length}`,
]

console.log(summary.join('\n'))

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`)
  for (const message of warnings) console.log(`  ! ${message}`)
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s):`)
  for (const message of errors) console.error(`  ✗ ${message}`)
  await rm(outDir, { recursive: true, force: true })
  process.exit(1)
}

console.log('\nAll cross-references resolved. No data-integrity errors.')
await rm(outDir, { recursive: true, force: true })

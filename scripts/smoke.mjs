#!/usr/bin/env node
/**
 * Route smoke test: server-renders every page, disease, pathway and case.
 * Catches runtime crashes that TypeScript and the bundler cannot see.
 *
 *   node scripts/smoke.mjs
 */
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const outFile = path.join(root, 'scripts', '.smoke.mjs')

await build({
  entryPoints: [path.join(root, 'scripts/smoke-entry.tsx')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  outfile: outFile,
  logLevel: 'silent',
  external: [
    'react',
    'react-dom',
    'react-dom/server',
    'react-router-dom',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'lucide-react',
  ],
})

// The bundle prints its own report; any thrown render error exits non-zero.
await import(`${pathToFileURL(outFile).href}?t=${Date.now()}`)

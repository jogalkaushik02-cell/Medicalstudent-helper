import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ShieldAlert } from 'lucide-react'
import { sectionLabel, type SectionId } from '../data'

type Tone = 'neutral' | 'ear' | 'eye' | 'warn' | 'danger' | 'ok'

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span className={clsx('badge', tone !== 'neutral' && `badge-${tone}`, className)}>
      {children}
    </span>
  )
}

export function SystemBadge({ system }: { system: SectionId | 'ent' | 'ophtho' }) {
  const tone: Record<string, 'ear' | 'eye'> = {
    ear: 'ear', nose: 'ear', pharynx: 'ear', larynx: 'ear', ent: 'ear',
    eye: 'eye', ophtho: 'eye',
  }
  const label: Record<string, string> = {
    ear: 'Ear', nose: 'Nose', pharynx: 'Pharynx', larynx: 'Larynx', ent: 'ENT', eye: 'Eye', ophtho: 'Ophthalmology',
  }
  return <Badge tone={tone[system]}>{label[system]}</Badge>
}

export function PageHead({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </header>
  )
}

export function Section({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={clsx('prose-section', className)}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="accuracy-banner" style={compact ? { marginBottom: 0 } : undefined}>
      <ShieldAlert size={16} style={{ flex: '0 0 auto', marginTop: 1 }} />
      <div>
        <strong>Educational use only.</strong> This build is not clinically validated and is not
        for diagnosis or patient care. 3D models are schematic; dimensions are teaching ranges.
        See <a href="/about" style={{ color: 'var(--teal)' }}>Accuracy &amp; limitations</a>.
      </div>
    </div>
  )
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="search-empty">
      <div style={{ color: 'var(--text)', marginBottom: 4 }}>{title}</div>
      <div>{text}</div>
    </div>
  )
}

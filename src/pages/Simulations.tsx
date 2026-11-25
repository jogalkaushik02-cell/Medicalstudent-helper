import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, Eye, FlaskConical, Waves } from 'lucide-react'
import AudiogramSim from '../components/sims/AudiogramSim'
import BppvSim from '../components/sims/BppvSim'
import AirwaySim from '../components/sims/AirwaySim'
import CataractSim from '../components/sims/CataractSim'
import FundusSim from '../components/sims/FundusSim'
import GlaucomaSim from '../components/sims/GlaucomaSim'
import VisualFieldSim from '../components/VisualFieldSim'
import { Disclaimer, PageHead } from '../components/ui'

const SECTIONS = [
  { id: 'audiogram', label: 'Audiogram' },
  { id: 'bppv', label: 'BPPV / Epley' },
  { id: 'airway', label: 'Airway narrowing' },
  { id: 'visual-field', label: 'Visual field' },
  { id: 'glaucoma', label: 'Glaucoma disc' },
  { id: 'fundus', label: 'Fundus' },
  { id: 'cataract', label: 'Cataract vision' },
]

function SimSection({
  id,
  index,
  title,
  subtitle,
  children,
}: {
  id: string
  index: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section id={id} className="sim-section">
      <div className="section-head">
        <div>
          <div className="eyebrow">Simulator {index}</div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <a className="btn btn-sm btn-ghost" href={`#${id}`}>
          Link to this
        </a>
      </div>
      <div className="card sim-card">{children}</div>
    </section>
  )
}

export default function Simulations() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const timer = window.setTimeout(() => {
      const element = document.getElementById(hash.slice(1))
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <div className="page">
      <PageHead
        eyebrow="Interactive teaching"
        title="Simulations"
        subtitle="Change the variables and watch the clinical picture change. Every simulator is schematic: it is designed to teach a pattern, not to reproduce a real device or predict an individual patient’s result."
        actions={
          <>
            <Link to="/pathways/visual" className="btn btn-sm">
              <Eye size={13} /> Visual pathway
            </Link>
            <Link to="/cases" className="btn btn-sm btn-primary">
              Apply it in a case
            </Link>
          </>
        }
      />

      <nav className="sim-nav" aria-label="Simulators">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="filter-btn">
            {section.label}
          </a>
        ))}
      </nav>

      <SimSection
        id="audiogram"
        index="01"
        title="Audiogram simulator"
        subtitle="Switch between conductive, sensorineural and mixed patterns, change severity and compare air with bone conduction."
      >
        <AudiogramSim />
      </SimSection>

      <SimSection
        id="bppv"
        index="02"
        title="BPPV & Epley simulator"
        subtitle="Walk the otoconia through the posterior canal, from a positive Dix–Hallpike to the end of the Epley sequence."
      >
        <BppvSim />
      </SimSection>

      <SimSection
        id="airway"
        index="03"
        title="Airway narrowing simulator"
        subtitle="Change the airway calibre and see stridor, voice and severity — a schematic glottis."
      >
        <AirwaySim />
      </SimSection>

      <SimSection
        id="visual-field"
        index="04"
        title="Visual field lesion localiser"
        subtitle="Pick a lesion along the visual pathway and compare the monocular field defects. Learn the prechiasmal / chiasmal / postchiasmal rules."
      >
        <VisualFieldSim defaultLesion="right-tract" />
      </SimSection>

      <SimSection
        id="glaucoma"
        index="05"
        title="Glaucoma disc simulator"
        subtitle="Increase the cup-to-disc ratio and intraocular pressure to see rim loss, notching and an arcuate field defect."
      >
        <GlaucomaSim />
      </SimSection>

      <SimSection
        id="fundus"
        index="06"
        title="Fundus pattern simulator"
        subtitle="Compare a normal fundus with non-proliferative diabetic retinopathy, wet AMD and papilloedema."
      >
        <FundusSim />
      </SimSection>

      <SimSection
        id="cataract"
        index="07"
        title="Cataract vision simulator"
        subtitle="See how lens opacity changes contrast, colour and glare — side by side with normal vision."
      >
        <CataractSim />
      </SimSection>

      <div className="cta-band">
        <div>
          <h2>Simulators are for pattern recognition</h2>
          <p>
            They deliberately simplify. Real audiometry, perimetry and fundoscopy require calibrated
            equipment, technique and clinical context.
          </p>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <Link to="/cases" className="btn btn-primary">
            <Activity size={14} /> Clinical cases
          </Link>
          <Link to="/about" className="btn">
            <Waves size={14} /> Limitations
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        <Disclaimer />
      </div>

      <div className="row small dim" style={{ gap: 7, marginTop: 14 }}>
        <FlaskConical size={12} />
        <span>All six simulators run entirely in the browser. No patient data is collected.</span>
      </div>
    </div>
  )
}

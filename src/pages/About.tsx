import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ShieldAlert } from 'lucide-react'
import { allStructures, clinicalCases, diseases, pathways } from '../data'
import { Disclaimer, PageHead } from '../components/ui'

export default function About() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Trust & limits"
        title="Accuracy & limitations"
        subtitle="What this atlas is, what has been checked, what is still schematic, and what must happen before anyone calls it clinically validated."
        actions={
          <Link to="/cases" className="btn btn-sm btn-primary">
            Test the content <ArrowRight size={13} />
          </Link>
        }
      />

      <div className="accuracy-banner">
        <ShieldAlert size={17} style={{ flex: '0 0 auto', marginTop: 1 }} />
        <div>
          <strong>We do not claim 99% or 100% accuracy.</strong> SENSE Atlas v0.1 is an educational
          preview. It has not been independently signed off by a clinician and is not a medical
          device, a diagnostic tool or a surgical planner. Accuracy is tracked claim by claim, and
          the unresolved claims are listed openly.
        </div>
      </div>

      <div className="about-grid">
        <div>
          <div className="card about-card" style={{ marginBottom: 13 }}>
            <h2>Our position</h2>
            <p>
              Anatomy and clinical content can look authoritative while still containing small,
              consequential errors. A single wrong dimension, nerve branch or drug dose is enough to
              mislead a student. So the product is built around a review ledger rather than a
              marketing accuracy figure.
            </p>
            <p>
              Every high-risk claim is written into a claims register, reviewed in passes, corrected
              with a dated decision log, and flagged for independent criticism. When a claim cannot be
              verified, the atlas says so instead of inventing certainty.
            </p>
            <p style={{ marginBottom: 0 }}>
              Version 0.1 is a <strong style={{ color: 'var(--text)' }}>reviewed preview</strong>, not
              a finished clinical reference. The next gate is external review by clinicians and
              anatomy teachers.
            </p>
          </div>

          <div className="card about-card" style={{ marginBottom: 13 }}>
            <h2>What has been checked in this build</h2>
            <ul>
              <li>TypeScript build, route integrity and production bundle.</li>
              <li>Every internal ID used by a disease, pathway, case or search result resolves.</li>
              <li>3D scene layering, click targets, labels and disease-overlay visibility.</li>
              <li>Terminology consistency (ENT vs ophthalmology, UK spelling, structure names).</li>
              <li>Responsive layout, keyboard access, focus states and reduced-motion behaviour.</li>
              <li>Known limitations and disclaimers repeated at the point of use.</li>
            </ul>
            <p style={{ marginBottom: 0 }}>
              The five review passes and every correction are recorded in{' '}
              <span className="mono">accuracy/DECISIONS.md</span> in the project repository.
            </p>
          </div>

          <div className="card about-card">
            <h2>Known limitations</h2>
            <ul className="limit-list">
              <li>The ear and eye meshes are hand-built teaching schematics, not scan-derived patient anatomy.</li>
              <li>They are not to scale. Dimensions in the text are teaching ranges, not measurements of the model.</li>
              <li>Some structures (orbit, eyelids, lacrimal system, conjunctiva, choroid, visual and pupillary pathways) are described but not separately modelled.</li>
              <li>Disease overlays show a concept, not a radiological or histological appearance.</li>
              <li>Simulators simplify real devices and real physiology; they cannot predict an individual patient’s result.</li>
              <li>Drug doses, investigation thresholds and management pathways vary by country and guideline; check locally.</li>
              <li>The whole-head model is not in v0.1. It needs licensed scan-derived data and a much larger review effort.</li>
              <li>The content is in English and has not yet been validated for a specific medical curriculum.</li>
              <li>No patient data is collected, stored or displayed.</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="card about-card" style={{ marginBottom: 13 }}>
            <h2>Content inventory · v0.1</h2>
            <div className="hero-stats" style={{ marginTop: 0, gap: 22 }}>
              <div>
                <div className="stat-value">{allStructures.length}</div>
                <div className="stat-label">Structures</div>
              </div>
              <div>
                <div className="stat-value">{diseases.length}</div>
                <div className="stat-label">Diseases</div>
              </div>
              <div>
                <div className="stat-value">{pathways.length}</div>
                <div className="stat-label">Pathways</div>
              </div>
              <div>
                <div className="stat-value">{clinicalCases.length}</div>
                <div className="stat-label">Cases</div>
              </div>
            </div>
            <div className="divider" />
            <p className="small muted" style={{ marginBottom: 0 }}>
              7 simulators · 1 global search index · 5 portals (ear, nose, pharynx, larynx, eye) · 2 3D explorers · 1 visual-field localiser.
              Content version <span className="mono">0.1.0</span>, November 2026.
            </p>
          </div>

          <div className="card about-card" style={{ marginBottom: 13 }}>
            <h2>Review pipeline</h2>
            <div className="roadmap">
              <div className="roadmap-item">
                <span className="roadmap-num">01</span>
                <div>
                  <h4>Build &amp; typecheck</h4>
                  <p>Production build, routing, dead links and runtime errors.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">02</span>
                <div>
                  <h4>Data integrity</h4>
                  <p>Every structure, disease, pathway, case and simulator reference resolves.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">03</span>
                <div>
                  <h4>3D geometry</h4>
                  <p>Occlusion, layer isolation, label anchors, click targets and overlays.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">04</span>
                <div>
                  <h4>Content &amp; terminology</h4>
                  <p>Claim-by-claim terminology, dimensions and high-risk clinical statements.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">05</span>
                <div>
                  <h4>UX, accessibility &amp; responsive</h4>
                  <p>Keyboard paths, contrast, focus, mobile layout and reduced motion.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card about-card">
            <h2>Whole-head roadmap</h2>
            <div className="roadmap">
              <div className="roadmap-item">
                <span className="roadmap-num">v0.2</span>
                <div>
                  <h4>Scan-derived regional meshes</h4>
                  <p>Licensed temporal-bone and orbit datasets, with a mesh provenance record.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">v0.3</span>
                <div>
                  <h4>Whole head</h4>
                  <p>Skull base, sinuses, brainstem, cranial nerves and orbital apex in one scene.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">v0.4</span>
                <div>
                  <h4>Assessment</h4>
                  <p>Spaced repetition, lesion-localisation drills and progress tracking.</p>
                </div>
              </div>
              <div className="roadmap-item">
                <span className="roadmap-num">v1.0</span>
                <div>
                  <h4>Independent sign-off</h4>
                  <p>Named clinical reviewers, a published corrections log and a stable content version.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-grid" style={{ marginTop: 13 }}>
        <div className="card about-card">
          <h2>What external reviewers should attack</h2>
          <p>
            The review packet asks specifically about the claims most likely to be wrong or
            oversimplified:
          </p>
          <ul>
            <li>Numbers: cochlear nerve axon count, structure dimensions, prevalence and dosing.</li>
            <li>3D geometry: pinna orientation, ossicular chain continuity, cochlear turns, globe and optic-nerve relationships.</li>
            <li>Pathway lesion levels: chiasm, Meyer loop, parietal radiation and macular sparing.</li>
            <li>Clinical management: AOM antibiotics, sudden SNHL, glaucoma, retinal detachment and papilloedema.</li>
            <li>Simulator assumptions: audiogram bone conduction, Epley sequence, CDR thresholds and field patterns.</li>
            <li>Language: anything that sounds more certain than the evidence allows.</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            The repository contains <span className="mono">REVIEW_REQUEST.md</span>,{' '}
            <span className="mono">accuracy/claims.csv</span> and{' '}
            <span className="mono">accuracy/DECISIONS.md</span> for a Claude / Gemini / ChatGPT
            review panel.
          </p>
        </div>

        <div className="card about-card">
          <h2>Corrections &amp; versioning</h2>
          <p>
            When a claim changes, the correction is dated and linked to the claim ID. The app ships a
            visible content version so a student can tell which edition they are reading.
          </p>
          <div className="dim-box">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Content version</span>
              <span className="mono">0.1.0</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 5 }}>
              <span>Review state</span>
              <span>5 internal passes complete</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 5 }}>
              <span>Independent clinical sign-off</span>
              <span style={{ color: 'var(--amber)' }}>Pending</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 5 }}>
              <span>Whole-head model</span>
              <span style={{ color: 'var(--dim)' }}>Roadmap</span>
            </div>
          </div>
          <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
            <BookOpen size={12} style={{ marginRight: 5, verticalAlign: -2 }} />
            If you find an error, treat it as a content bug: record the claim, the source and the
            correction, then re-run the relevant review pass.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Disclaimer />
      </div>
    </div>
  )
}

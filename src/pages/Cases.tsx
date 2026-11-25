import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardList,
  RotateCcw,
  Stethoscope,
  X,
} from 'lucide-react'
import { casesById, clinicalCases, diseasesById } from '../data'
import type { ClinicalCase } from '../data'
import { Badge, EmptyState, PageHead, SystemBadge } from '../components/ui'

type SystemFilter = 'all' | 'ent' | 'ophtho'
type DifficultyFilter = 'all' | ClinicalCase['difficulty']

export default function Cases() {
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('case')
  const selected = selectedId ? casesById[selectedId] : undefined

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [system, setSystem] = useState<SystemFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')

  const filtered = useMemo(
    () =>
      clinicalCases.filter((item) => {
        if (system !== 'all' && item.system !== system) return false
        if (difficulty !== 'all' && item.difficulty !== difficulty) return false
        return true
      }),
    [system, difficulty],
  )

  const openCase = (id: string) => {
    const next = new URLSearchParams(params)
    next.set('case', id)
    setParams(next)
  }

  const closeCase = () => {
    const next = new URLSearchParams(params)
    next.delete('case')
    setParams(next)
  }

  if (selected) {
    const answer = answers[selected.id]
    const answered = answer !== undefined
    const correctIndex = selected.options.findIndex((option) => option.correct)
    const diagnosis = diseasesById[selected.diagnosisId]
    const index = clinicalCases.findIndex((item) => item.id === selected.id)
    const nextCase = clinicalCases[(index + 1) % clinicalCases.length]

    return (
      <div className="page">
        <button type="button" className="btn btn-sm btn-ghost" onClick={closeCase} style={{ marginBottom: 14 }}>
          <ArrowLeft size={13} /> All cases
        </button>

        <div className="page-head" style={{ marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Clinical case · {selected.difficulty}</div>
            <h1 style={{ fontSize: 34 }}>{selected.title}</h1>
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            <SystemBadge system={selected.system} />
            <Badge tone="warn">Educational case</Badge>
          </div>
        </div>

        <div className="case-player">
          <div>
            <div className="vignette">{selected.vignette}</div>

            <h2 className="case-question">{selected.question}</h2>

            <div className="options" role="group" aria-label="Answer options">
              {selected.options.map((option, optionIndex) => {
                const isCorrect = option.correct
                const isChosen = answer === optionIndex
                const className = answered
                  ? `option${isCorrect ? ' correct' : isChosen ? ' wrong' : ''}`
                  : 'option'
                return (
                  <button
                    key={option.text}
                    type="button"
                    className={className}
                    onClick={() => {
                      if (answered) return
                      setAnswers((current) => ({ ...current, [selected.id]: optionIndex }))
                    }}
                    disabled={answered}
                    aria-pressed={isChosen}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block' }}>{option.text}</span>
                      {answered && (isCorrect || isChosen) && (
                        <span
                          style={{
                            display: 'block',
                            marginTop: 5,
                            color: isCorrect ? '#a7f3d0' : '#fecdd3',
                            fontSize: 10.5,
                            lineHeight: 1.55,
                          }}
                        >
                          {isCorrect ? 'Correct — ' : 'Your choice — '}
                          {option.why}
                        </span>
                      )}
                    </span>
                    {answered && isCorrect && <Check size={14} style={{ color: '#34d399', flex: '0 0 auto' }} />}
                    {answered && isChosen && !isCorrect && <X size={14} style={{ color: '#fb7185', flex: '0 0 auto' }} />}
                  </button>
                )
              })}
            </div>

            <div className="case-result" aria-live="polite">
              {answered ? (
                answer === correctIndex ? (
                  <>
                    <Check size={15} style={{ color: '#34d399' }} />
                    <span>
                      <strong style={{ color: '#a7f3d0' }}>Correct.</strong> {diagnosis?.name ?? 'Diagnosis'} —{' '}
                      {diagnosis ? <Link to={`/diseases/${diagnosis.id}`} style={{ color: 'var(--teal)' }}>read the condition</Link> : null}
                    </span>
                  </>
                ) : (
                  <>
                    <X size={15} style={{ color: '#fb7185' }} />
                    <span>
                      <strong style={{ color: '#fecdd3' }}>Not quite.</strong> The best answer is{' '}
                      {String.fromCharCode(65 + correctIndex)} — {selected.options[correctIndex]?.text}
                    </span>
                  </>
                )
              ) : (
                <>
                  <ClipboardList size={15} />
                  <span>Commit to an answer before revealing the explanation.</span>
                </>
              )}
            </div>

            {answered && (
              <div className="explanation">
                <h3>Why this fits</h3>
                <ul>
                  {selected.explanation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="pearl" style={{ marginTop: 10 }}>
                  {selected.pearl}
                </div>
              </div>
            )}

            <div className="row wrap" style={{ gap: 7, marginTop: 14 }}>
              <button type="button" className="btn btn-sm" onClick={() => openCase(nextCase.id)}>
                Next case <ChevronRight size={13} />
              </button>
              {answered && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() =>
                    setAnswers((current) => {
                      const next = { ...current }
                      delete next[selected.id]
                      return next
                    })
                  }
                >
                  <RotateCcw size={13} /> Try again
                </button>
              )}
              <Link to="/diseases" className="btn btn-sm btn-ghost">
                <Stethoscope size={13} /> Disease library
              </Link>
            </div>
          </div>

          <aside>
            <div className="card pathway-side">
              <div className="detail-head">
                <SystemBadge system={selected.system} />
                <Badge>{selected.difficulty}</Badge>
              </div>
              <h3>{selected.title}</h3>
              <p>
                {answered
                  ? diagnosis?.tagline ?? 'Review the explanation and the linked disease.'
                  : 'Answer first, then the diagnosis, explanation and linked anatomy appear here.'}
              </p>

              {answered && diagnosis && (
                <>
                  <div className="dim-box" style={{ marginTop: 12 }}>
                    <strong style={{ color: 'var(--text)' }}>{diagnosis.name}</strong>
                    <div style={{ marginTop: 5 }}>{diagnosis.tagline}</div>
                  </div>
                  <Link to={`/diseases/${diagnosis.id}`} className="btn btn-sm btn-primary" style={{ marginTop: 10 }}>
                    Open disease entry <ArrowRight size={13} />
                  </Link>
                </>
              )}

              <div className="divider" />
              <div className="control-label" style={{ marginBottom: 6 }}>
                Case {index + 1} of {clinicalCases.length}
              </div>
              <div className="linked-list">
                {clinicalCases
                  .filter((item) => item.id !== selected.id)
                  .slice(0, 5)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="linked-item"
                      onClick={() => openCase(item.id)}
                      style={{ textAlign: 'left' }}
                    >
                      <span>{item.title}</span>
                      <ChevronRight size={12} />
                    </button>
                  ))}
              </div>
            </div>

            <div className="accuracy-banner" style={{ marginTop: 12, marginBottom: 0 }}>
              <span>
                Cases are teaching vignettes, not real patient records. Management must follow local
                guidelines.
              </span>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <PageHead
        eyebrow="Clinical reasoning"
        title="Clinical cases"
        subtitle="Twelve ENT and ophthalmology vignettes. Choose an answer, then read why each option is right or wrong. Progress is kept while this page is open."
        actions={
          <>
            <Link to="/diseases" className="btn btn-sm">
              Disease library
            </Link>
            <Link to="/simulations" className="btn btn-sm btn-primary">
              Simulators
            </Link>
          </>
        }
      />

      <div className="filter-row" role="group" aria-label="Filter by system">
        <button type="button" className={`filter-btn${system === 'all' ? ' active' : ''}`} onClick={() => setSystem('all')} aria-pressed={system === 'all'}>
          All · {clinicalCases.length}
        </button>
        <button type="button" className={`filter-btn${system === 'ent' ? ' active' : ''}`} onClick={() => setSystem('ent')} aria-pressed={system === 'ent'}>
          ENT
        </button>
        <button type="button" className={`filter-btn${system === 'ophtho' ? ' active' : ''}`} onClick={() => setSystem('ophtho')} aria-pressed={system === 'ophtho'}>
          Ophthalmology
        </button>
      </div>

      <div className="filter-row" role="group" aria-label="Filter by difficulty" style={{ marginTop: -10 }}>
        {(['all', 'Foundation', 'Clinical', 'Exam'] as DifficultyFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            className={`filter-btn${difficulty === value ? ' active' : ''}`}
            onClick={() => setDifficulty(value)}
            aria-pressed={difficulty === value}
          >
            {value === 'all' ? 'All levels' : value}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No cases match" text="Choose another system or difficulty." />
      ) : (
        <div className="cases-grid">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="card case-card"
              onClick={() => openCase(item.id)}
              style={{ textAlign: 'left' }}
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <SystemBadge system={item.system} />
                <Badge>{item.difficulty}</Badge>
              </div>
              <h3>{item.title}</h3>
              <p>{item.vignette.slice(0, 156)}…</p>
              <div className="case-tags">
                <span className="chip">
                  <ClipboardList size={10} /> {item.question.replace('?', '')}
                </span>
                {answers[item.id] !== undefined && (
                  <span className={`badge ${answers[item.id] === item.options.findIndex((option) => option.correct) ? 'badge-ok' : 'badge-danger'}`}>
                    answered
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="cta-band">
        <div>
          <h2>Want the theory first?</h2>
          <p>Every case links back to a disease entry, the relevant anatomy and a simulator where one exists.</p>
        </div>
        <Link to="/diseases" className="btn btn-primary">
          Browse diseases <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

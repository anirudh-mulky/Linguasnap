import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Phrase } from '../hooks/usePhrases'
import { useQuiz } from '../hooks/useQuiz'
import FlashCard from '../components/FlashCard'

interface LocationState { phrases: Phrase[]; language: string; scenario: string }

export default function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { phrases, language, scenario } = (location.state as LocationState) ?? {}

  const { state, reveal, answer, saveProgress, reset } = useQuiz(
    phrases ?? [], language ?? '', scenario ?? ''
  )

  useEffect(() => {
    if (!phrases?.length) navigate('/learn', { replace: true })
  }, [phrases, navigate])

  useEffect(() => {
    if (state.finished) saveProgress(state)
  }, [state.finished])

  if (!phrases?.length) return null
  const current = phrases[state.index]

  // ── Finished ────────────────────────────────────────────────────
  if (state.finished) {
    const pct = Math.round((state.correct / phrases.length) * 100)
    const great = pct >= 70
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 60% 0%, #e5ffc2 0%, #f7f7f7 60%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div className="card" style={{ width: '100%', maxWidth: 460, padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{great ? '🎉' : '💪'}</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>
            {great ? 'Great work!' : 'Keep it up!'}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 600, marginBottom: 32 }}>
            You got {state.correct} out of {phrases.length} correct
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Correct', value: state.correct, color: 'var(--green)', bg: 'var(--green-lt)' },
              { label: 'Missed',  value: state.missed,  color: 'var(--red)',   bg: 'var(--red-lt)'   },
              { label: 'XP',      value: `+${state.xp}`, color: 'var(--blue)', bg: 'var(--blue-lt)'  },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius)', padding: '16px 8px' }}>
                <p style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: s.color, opacity: .7, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {state.streak > 2 && (
            <div className="streak-badge" style={{ margin: '0 auto 28px', width: 'fit-content' }}>
              🔥 Best streak: {state.streak}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={reset} className="btn btn-ghost" style={{ flex: 1 }}>Retry</button>
            <button onClick={() => navigate('/learn')} className="btn btn-primary" style={{ flex: 1 }}>Continue →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz ─────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 40% 0%, #e8f7ff 0%, #f7f7f7 55%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        maxWidth: 780, width: '100%', margin: '0 auto',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate('/learn')} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>
          ← Back
        </button>

        {/* Progress bar in header */}
        <div style={{ flex: 1, margin: '0 24px' }}>
          <div className="xp-bar" style={{ height: 10 }}>
            <div className="xp-fill" style={{
              width: `${Math.round((state.index / phrases.length) * 100)}%`,
              background: 'var(--blue)',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: 'var(--blue-lt)', color: 'var(--blue)',
            borderRadius: 999, padding: '6px 16px', fontSize: 14, fontWeight: 900,
          }}>
            ⚡ {state.xp} XP
          </span>
          {state.streak > 1 && <div className="streak-badge">🔥 {state.streak}</div>}
        </div>
      </div>

      {/* Main content — centered, wide */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px 48px',
        gap: 24,
        width: '100%',
      }}>

        {/* Card number */}
        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          Card {state.index + 1} of {phrases.length}
        </p>

        {/* Flashcard — wide */}
        <div style={{ width: '100%', maxWidth: 680 }}>
          <FlashCard
            phrase={current}
            revealed={state.revealed}
            onReveal={reveal}
            total={phrases.length}
            index={state.index}
          />
        </div>

        {/* Answer buttons — wide */}
        {state.revealed && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 680 }}>
            <button onClick={() => answer(false)} className="btn btn-danger" style={{ padding: '20px 24px', fontSize: 16 }}>
              ✕ Missed it
            </button>
            <button onClick={() => answer(true)} className="btn btn-success" style={{ padding: '20px 24px', fontSize: 16 }}>
              ✓ Got it!
            </button>
          </div>
        )}

        {/* Dot progress */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 680, width: '100%' }}>
          {phrases.map((_, i) => (
            <span key={i} style={{
              flex: 1, maxWidth: 40, height: 6, borderRadius: 999,
              background: i < state.index ? 'var(--green)' : i === state.index ? 'var(--blue)' : 'var(--border)',
              transition: 'background .3s',
            }} />
          ))}
        </div>

      </div>
    </div>
  )
}
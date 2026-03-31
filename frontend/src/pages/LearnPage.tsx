import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageSelector from '../components/LanguageSelector'
import ScenarioPicker, { type ScenarioId, type LevelId } from '../components/ScenarioPicker'
import PhraseCard from '../components/PhraseCard'
import PhraseCardSkeleton from '../components/PhraseCardSkeleton'
import { usePhrases } from '../hooks/usePhrases'

const SKELETON_COUNT = 7

export default function LearnPage() {
  const [language, setLanguage]     = useState('Spanish')
  const [scenario, setScenario]     = useState<ScenarioId>('airport')
  const [level, setLevel]           = useState<LevelId>('tourist')
  const [configured, setConfigured] = useState(false)

  const { phrases, loading, error, fetchPhrases, clear } = usePhrases()
  const navigate = useNavigate()
  const hasResults = phrases.length > 0

  const handleGenerate    = () => { setConfigured(true); fetchPhrases(language, scenario, level) }
  const handleRegenerate  = () => fetchPhrases(language, scenario, level, true)
  const handleReset       = () => { clear(); setConfigured(false) }
  const handleStartQuiz   = () => navigate('/quiz', { state: { phrases, language, scenario } })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Config card */}
      <div className="card">
        {!configured ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>
                What do you want to learn?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>
                Pick a language and scenario to get started.
              </p>
            </div>
            <LanguageSelector value={language} onChange={setLanguage} />
            <ScenarioPicker
              scenario={scenario}
              level={level}
              onScenarioChange={setScenario}
              onLevelChange={setLevel}
            />
            <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%' }}>
              Generate phrases
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', textTransform: 'capitalize' }}>
                {language} · {scenario} · {level}
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>
                {hasResults ? `${phrases.length} phrases generated` : 'Generating…'}
              </p>
            </div>
            <button onClick={handleReset} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
              Change →
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && !loading && (
        <div style={{
          background: 'var(--red-lt)', color: 'var(--red)',
          borderRadius: 'var(--radius)', padding: '12px 16px',
          fontSize: 14, fontWeight: 700,
        }}>
          {error}
        </div>
      )}

      {/* Phrase grid */}
      {(loading || hasResults) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {loading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => <PhraseCardSkeleton key={i} />)
            : phrases.map((p, i) => <PhraseCard key={i} phrase={p} index={i} language={language} />)
          }
        </div>
      )}

      {/* Actions */}
      {hasResults && !loading && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleStartQuiz} className="btn btn-primary" style={{ flex: 1 }}>
            Start quiz →
          </button>
          <button onClick={handleRegenerate} className="btn btn-ghost">
            Regenerate
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasResults && !error && !configured && (
        <div style={{
          background: 'var(--card)',
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '60px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--muted)' }}>
            Choose a language and scenario above to get started.
          </p>
        </div>
      )}

    </div>
  )
}
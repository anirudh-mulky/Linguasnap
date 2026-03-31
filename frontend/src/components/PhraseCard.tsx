 
import type { Phrase } from '../hooks/usePhrases'
import { useSpeech } from '../hooks/useSpeech'

const DIFF_PILL: Record<number, { cls: string; label: string }> = {
  1: { cls: 'pill pill-easy',   label: 'Easy'     },
  2: { cls: 'pill pill-easy',   label: 'Easy'     },
  3: { cls: 'pill pill-medium', label: 'Medium'   },
  4: { cls: 'pill pill-hard',   label: 'Hard'     },
  5: { cls: 'pill pill-hard',   label: 'Advanced' },
}

interface Props { phrase: Phrase; index: number; language: string }

export default function PhraseCard({ phrase, index, language }: Props) {
  const { speak, stop, speaking, supported } = useSpeech()
  const diff = DIFF_PILL[phrase.difficulty] ?? DIFF_PILL[3]

  const handlePlay = () => speaking ? stop() : speak(phrase.original, language)

  return (
    <div style={{
      background: 'var(--card)',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'border-color .15s, transform .15s',
      cursor: 'default',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--green)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--green-lt)', color: '#2E7D00',
          fontSize: 12, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {index + 1}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {supported && (
            <button
              onClick={handlePlay}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: speaking ? 'var(--green)' : 'var(--border)',
                color: speaking ? '#fff' : 'var(--text)',
                cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title={speaking ? 'Stop' : 'Listen'}
            >
              {speaking ? '■' : '▶'}
            </button>
          )}
          <span className={diff.cls}>{diff.label}</span>
        </div>
      </div>

      {/* Original */}
      <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', lineHeight: 1.3 }}>
        {phrase.original}
      </p>

      {/* Phonetic */}
      <p style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--blue)', letterSpacing: '.04em' }}>
        {phrase.phonetic}
      </p>

      {/* Translation */}
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--muted)' }}>
        {phrase.translation}
      </p>

      {/* Difficulty dots */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{
            height: 6, width: 20, borderRadius: 999,
            background: i < phrase.difficulty ? 'var(--green)' : 'var(--border)',
            transition: 'background .2s',
          }} />
        ))}
      </div>

      {/* Usage note */}
      {phrase.usage_note && (
        <p style={{
          fontSize: 12, fontWeight: 700, color: 'var(--muted)',
          fontStyle: 'italic',
          borderTop: '1.5px solid var(--border)',
          paddingTop: 10, marginTop: 2,
        }}>
          💡 {phrase.usage_note}
        </p>
      )}
    </div>
  )
}
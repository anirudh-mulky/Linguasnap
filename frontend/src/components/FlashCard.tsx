 
import type { Phrase } from '../hooks/usePhrases'

interface Props {
  phrase: Phrase
  revealed: boolean
  onReveal: () => void
  total: number
  index: number
}

export default function FlashCard({ phrase, revealed, onReveal, total, index }: Props) {
  const progress = Math.round((index / total) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="xp-bar" style={{ flex: 1 }}>
          <div className="xp-fill" style={{ width: `${progress}%`, background: 'var(--blue)' }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', minWidth: 40 }}>
          {index + 1}/{total}
        </span>
      </div>

      {/* Card */}
      <div
        onClick={!revealed ? onReveal : undefined}
        style={{
          background: 'var(--card)',
          border: `2.5px solid ${revealed ? 'var(--border)' : 'var(--blue)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: 36,
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          textAlign: 'center',
          cursor: revealed ? 'default' : 'pointer',
          transition: 'border-color .2s, transform .1s',
          transform: revealed ? 'none' : undefined,
        }}
        onMouseEnter={e => { if (!revealed) e.currentTarget.style.transform = 'scale(1.01)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
      >
        {/* Original */}
        <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', lineHeight: 1.2 }}>
          {phrase.original}
        </p>

        {/* Phonetic */}
        <p style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'var(--blue)', letterSpacing: '.05em' }}>
          {phrase.phonetic}
        </p>

        {/* Reveal hint / translation */}
        {!revealed ? (
          <div style={{
            marginTop: 8,
            background: 'var(--blue-lt)',
            color: 'var(--blue)',
            borderRadius: 999,
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 800,
          }}>
            Tap to reveal
          </div>
        ) : (
          <div style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn .2s ease',
          }}>
            <div style={{ width: 40, height: 2, background: 'var(--border)', borderRadius: 999 }} />
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
              {phrase.translation}
            </p>
            {phrase.usage_note && (
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', fontStyle: 'italic' }}>
                💡 {phrase.usage_note}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
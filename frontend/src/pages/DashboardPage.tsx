import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

interface Session {
  language: string; scenario: string
  xp: number; streak: number; last_played: string
}
interface Summary { total_xp: number; streak: number; sessions: Session[] }

const LANG_FLAG: Record<string, string> = {
  Spanish:'🇪🇸', French:'🇫🇷', German:'🇩🇪', Italian:'🇮🇹',
  Portuguese:'🇧🇷', Japanese:'🇯🇵', Korean:'🇰🇷', Mandarin:'🇨🇳',
  Arabic:'🇸🇦', Hindi:'🇮🇳', Russian:'🇷🇺', Dutch:'🇳🇱',
  Polish:'🇵🇱', Turkish:'🇹🇷', Swedish:'🇸🇪', Greek:'🇬🇷',
  Thai:'🇹🇭', Vietnamese:'🇻🇳', Indonesian:'🇮🇩', Hebrew:'🇮🇱',
  Swahili:'🇰🇪', Ukrainian:'🇺🇦',
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get<Summary>('/api/progress/summary')
      .then(r => setSummary(r.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: 80, borderRadius: 'var(--radius-xl)',
          background: 'var(--border)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
    </div>
  )

  const noData = !summary || summary.sessions.length === 0
  const level  = noData ? 1 : Math.floor(summary.total_xp / 100) + 1
  const progress = noData ? 0 : summary.total_xp % 100

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)' }}>Your progress</h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>
          Keep practising daily to build your streak.
        </p>
      </div>

      {noData ? (
        <div style={{
          background: 'var(--card)', border: '2px dashed var(--border)',
          borderRadius: 'var(--radius-xl)', padding: 60, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--muted)', marginBottom: 20 }}>
            Complete a quiz to see your stats here
          </p>
          <button onClick={() => navigate('/learn')} className="btn btn-primary">
            Start learning →
          </button>
        </div>
      ) : (
        <>
          {/* Level + XP bar */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Level
                </p>
                <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>{level}</p>
              </div>
              <div className="streak-badge">🔥 {summary!.streak} day streak</div>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{progress} XP</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{100 - progress} XP to level {level + 1}</span>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
            {[
              { label: 'Total XP',  value: summary!.total_xp, color: 'var(--green)', bg: 'var(--green-lt)' },
              { label: 'Sessions',  value: summary!.sessions.length, color: 'var(--blue)', bg: 'var(--blue-lt)' },
              { label: 'Best streak', value: `${summary!.streak}🔥`, color: 'var(--orange)', bg: 'var(--orange-lt)' },
            ].map(s => (
              <div key={s.label} style={{
                background: s.bg, borderRadius: 'var(--radius-xl)',
                padding: '20px 16px', textAlign: 'center',
              }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: s.color, opacity: .7, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Session history */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '2px solid var(--border)' }}>
              <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Recent sessions
              </p>
            </div>
            {summary!.sessions.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px',
                borderBottom: i < summary!.sessions.length - 1 ? '1.5px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{LANG_FLAG[s.language] ?? '🌍'}</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{s.language}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'capitalize' }}>
                      {s.scenario} · {new Date(s.last_played).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {s.streak > 1 && (
                    <div className="streak-badge" style={{ padding: '4px 10px', fontSize: 12 }}>
                      🔥 {s.streak}
                    </div>
                  )}
                  <span style={{
                    background: 'var(--green-lt)', color: '#2E7D00',
                    borderRadius: 999, padding: '4px 12px',
                    fontSize: 14, fontWeight: 900,
                  }}>
                    +{s.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
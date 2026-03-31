
export const SCENARIOS = [
  {
    id: 'airport',
    label: 'Airport',
    description: 'Check-in, gates, customs',
    color: '#1CB0F6', bg: '#E8F7FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    description: 'Order food & drinks',
    color: '#FF9600', bg: '#FFF0CC',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  {
    id: 'shopping',
    label: 'Shopping',
    description: 'Markets & stores',
    color: '#CE82FF', bg: '#F5EEFF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    id: 'medical',
    label: 'Medical',
    description: 'Pharmacy, emergencies',
    color: '#FF4B4B', bg: '#FFECEC',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    id: 'work',
    label: 'Job interview',
    description: 'Workplace & interviews',
    color: '#58CC02', bg: '#E5FFC2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
      </svg>
    ),
  },
] as const

export type ScenarioId = (typeof SCENARIOS)[number]['id']

export const LEVELS = [
  { id: 'tourist',        label: 'Tourist',        desc: 'Survival phrases' },
  { id: 'conversational', label: 'Conversational', desc: 'Everyday talk'    },
  { id: 'fluent',         label: 'Fluent',         desc: 'Natural speech'   },
] as const

export type LevelId = (typeof LEVELS)[number]['id']

interface Props {
  scenario: ScenarioId
  level: LevelId
  onScenarioChange: (s: ScenarioId) => void
  onLevelChange: (l: LevelId) => void
}

export default function ScenarioPicker({ scenario, level, onScenarioChange, onLevelChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Scenario grid */}
      <div>
        <label>Scenario</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {SCENARIOS.map(s => {
            const active = scenario === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onScenarioChange(s.id as ScenarioId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 'var(--radius)',
                  border: `2px solid ${active ? s.color : 'var(--border)'}`,
                  background: active ? s.bg : 'var(--card)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all .15s',
                  fontFamily: 'inherit',
                  boxShadow: active ? `0 0 0 3px ${s.color}22` : 'none',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = s.color }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                {/* Icon pill */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: active ? s.color : s.bg,
                  color: active ? '#fff' : s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: active ? s.color : 'var(--text)', margin: 0 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: active ? s.color : 'var(--muted)', margin: 0, opacity: active ? .8 : 1 }}>
                    {s.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Difficulty pills */}
      <div>
        <label>Difficulty</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LEVELS.map(l => {
            const active = level === l.id
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onLevelChange(l.id as LevelId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 20px',
                  borderRadius: 999,
                  border: `2px solid ${active ? 'var(--green)' : 'var(--border)'}`,
                  background: active ? 'var(--green)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--muted)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all .15s',
                  boxShadow: active ? '0 3px 0 var(--green-dk)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 800 }}>{l.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, opacity: .75 }}>{l.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
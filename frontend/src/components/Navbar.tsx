import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--card)',
      borderBottom: '2px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        {/* Logo */}
        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', letterSpacing: '-.02em' }}>
          Lingua<span style={{ color: 'var(--green)' }}>Snap</span>
        </span>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ to: '/learn', label: '📚 Learn' }, { to: '/dashboard', label: '📊 Dashboard' }].map(l => (
            <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 800,
              textDecoration: 'none',
              background: isActive ? 'var(--green-lt)' : 'transparent',
              color: isActive ? '#2E7D00' : 'var(--muted)',
              transition: 'all .15s',
            })}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setDark(d => !d)}
            style={{
              background: 'none', border: '2px solid var(--border)',
              borderRadius: 999, width: 36, height: 36,
              cursor: 'pointer', fontSize: 16, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
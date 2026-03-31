

function Shimmer({ w, h, radius = 8 }: { w: string; h: number; radius?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: 'var(--border)',
      animation: 'shimmer 1.4s ease-in-out infinite',
    }} />
  )
}

export default function PhraseCardSkeleton() {
  return (
    <div style={{
      background: 'var(--card)',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Shimmer w="26px" h={26} radius={999} />
        <Shimmer w="60px" h={22} radius={999} />
      </div>
      <Shimmer w="75%" h={24} />
      <Shimmer w="50%" h={16} />
      <Shimmer w="90%" h={16} />
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 5 }, (_, i) => <Shimmer key={i} w="20px" h={6} radius={999} />)}
      </div>
    </div>
  )
}
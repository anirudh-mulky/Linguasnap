

export const LANGUAGES = [
  { code: 'Spanish',    flag: '🇪🇸' },
  { code: 'French',     flag: '🇫🇷' },
  { code: 'German',     flag: '🇩🇪' },
  { code: 'Italian',    flag: '🇮🇹' },
  { code: 'Portuguese', flag: '🇧🇷' },
  { code: 'Japanese',   flag: '🇯🇵' },
  { code: 'Korean',     flag: '🇰🇷' },
  { code: 'Mandarin',   flag: '🇨🇳' },
  { code: 'Arabic',     flag: '🇸🇦' },
  { code: 'Hindi',      flag: '🇮🇳' },
  { code: 'Russian',    flag: '🇷🇺' },
  { code: 'Dutch',      flag: '🇳🇱' },
  { code: 'Polish',     flag: '🇵🇱' },
  { code: 'Turkish',    flag: '🇹🇷' },
  { code: 'Swedish',    flag: '🇸🇪' },
  { code: 'Greek',      flag: '🇬🇷' },
  { code: 'Thai',       flag: '🇹🇭' },
  { code: 'Vietnamese', flag: '🇻🇳' },
  { code: 'Indonesian', flag: '🇮🇩' },
  { code: 'Hebrew',     flag: '🇮🇱' },
  { code: 'Swahili',    flag: '🇰🇪' },
  { code: 'Ukrainian',  flag: '🇺🇦' },
]

interface Props {
  value: string
  onChange: (lang: string) => void
}

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <div>
      <label>Target language</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag}  {l.code}
          </option>
        ))}
      </select>
    </div>
  )
}
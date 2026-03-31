import { useState, useCallback } from 'react'
import api from '../api/client'

export interface Phrase {
  original: string
  translation: string
  phonetic: string
  difficulty: number
  usage_note?: string
}

interface UsePhrases {
  phrases: Phrase[]
  loading: boolean
  error: string | null
  fetchPhrases: (language: string, scenario: string, level: string, bust?: boolean) => Promise<void>
  clear: () => void
}

export function usePhrases(): UsePhrases {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPhrases = useCallback(async (
    language: string,
    scenario: string,
    level: string,
    bust = false
  ) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post<{ phrases: Phrase[] }>('/api/phrases', {
        language,
        scenario,
        level,
      }, { params: bust ? { bust: 1 } : {} })
      setPhrases(data.phrases)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch phrases'
      setError(msg)
      setPhrases([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setPhrases([])
    setError(null)
  }, [])

  return { phrases, loading, error, fetchPhrases, clear }
}
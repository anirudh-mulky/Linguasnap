import { useState, useCallback } from 'react'
import type { Phrase } from './usePhrases'
import api from '../api/client'

export interface QuizState {
  index: number
  correct: number
  missed: number
  xp: number
  streak: number
  revealed: boolean
  finished: boolean
}

const XP_PER_CORRECT = 10

export function useQuiz(phrases: Phrase[], language: string, scenario: string) {
  const [state, setState] = useState<QuizState>({
    index: 0,
    correct: 0,
    missed: 0,
    xp: 0,
    streak: 0,
    revealed: false,
    finished: false,
  })
  const [saving, setSaving] = useState(false)

  const reveal = useCallback(() => {
    setState(s => ({ ...s, revealed: true }))
  }, [])

  const answer = useCallback((knew: boolean) => {
    setState(s => {
      const newCorrect  = s.correct + (knew ? 1 : 0)
      const newMissed   = s.missed  + (knew ? 0 : 1)
      const newStreak   = knew ? s.streak + 1 : 0
      const newXP       = s.xp + (knew ? XP_PER_CORRECT + newStreak : 0)
      const nextIndex   = s.index + 1
      const finished    = nextIndex >= phrases.length

      return {
        index:    nextIndex,
        correct:  newCorrect,
        missed:   newMissed,
        xp:       newXP,
        streak:   newStreak,
        revealed: false,
        finished,
      }
    })
  }, [phrases.length])

  const saveProgress = useCallback(async (finalState: QuizState) => {
    setSaving(true)
    try {
      await api.post('/api/progress', {
        language,
        scenario,
        xp_earned: finalState.xp,
        correct:   finalState.correct,
        total:     phrases.length,
      })
    } catch (e) {
      console.error('Failed to save progress', e)
    } finally {
      setSaving(false)
    }
  }, [language, scenario, phrases.length])

  const reset = useCallback(() => {
    setState({
      index: 0, correct: 0, missed: 0,
      xp: 0, streak: 0, revealed: false, finished: false,
    })
  }, [])

  return { state, reveal, answer, saveProgress, reset, saving }
}
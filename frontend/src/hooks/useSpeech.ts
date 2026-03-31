import { useState, useCallback, useEffect } from 'react'

export const LANGUAGE_LOCALES: Record<string, string> = {
  Spanish:    'es-ES',
  French:     'fr-FR',
  German:     'de-DE',
  Italian:    'it-IT',
  Portuguese: 'pt-BR',
  Japanese:   'ja-JP',
  Korean:     'ko-KR',
  Mandarin:   'zh-CN',
  Arabic:     'ar-001',
  Hindi:      'hi-IN',
  Russian:    'ru-RU',
  Dutch:      'nl-NL',
  Polish:     'pl-PL',
  Turkish:    'tr-TR',
  Swedish:    'sv-SE',
  Greek:      'el-GR',
  Thai:       'th-TH',
  Vietnamese: 'vi-VN',
  Indonesian: 'id-ID',
  Hebrew:     'he-IL',
  Swahili:    'sw-KE',
  Ukrainian:  'uk-UA',
}

// Pre-load voices as early as possible
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
}

interface UseSpeech {
  speak: (text: string, language: string) => void
  stop: () => void
  speaking: boolean
  supported: boolean
}

export function useSpeech(): UseSpeech {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    return () => { if (supported) window.speechSynthesis.cancel() }
  }, [supported])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback((text: string, language: string) => {
    if (!supported) return
    window.speechSynthesis.cancel()

    const locale = LANGUAGE_LOCALES[language] ?? 'en-US'

    // Always wait a tick — fixes the "voices not ready" race on Safari/Mac
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = locale
      utterance.rate = 0.85

      const langPrefix = locale.split('-')[0]
      const pool = voices.filter(v => v.lang === locale).length
        ? voices.filter(v => v.lang === locale)
        : voices.filter(v => v.lang.startsWith(langPrefix))

      const preferred = pool.find(v =>
        /Eddy|Flo|Reed|Rocko|Sandy|Shelley|Grandma|Grandpa/.test(v.name)
      )
      utterance.voice = preferred ?? pool[0] ?? null

      console.log(`Speaking "${text}" | locale: ${locale} | voice: ${utterance.voice?.name}`)

      utterance.onstart = () => setSpeaking(true)
      utterance.onend   = () => setSpeaking(false)
      utterance.onerror = (e) => { console.error('TTS error', e); setSpeaking(false) }

      window.speechSynthesis.speak(utterance)
    }, 50)
  }, [supported])

  return { speak, stop, speaking, supported }
}
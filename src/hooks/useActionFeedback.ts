import { useCallback, useEffect, useRef, useState } from 'react'

export type ActionFeedbackState = 'idle' | 'success' | 'error'

interface UseActionFeedbackOptions {
  duration?: number
}

export function useActionFeedback({
  duration = 1500,
}: UseActionFeedbackOptions = {}) {
  const [state, setState] = useState<ActionFeedbackState>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setState('idle')
  }, [])

  const showSuccess = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setState('success')
    timeoutRef.current = setTimeout(() => {
      setState('idle')
      timeoutRef.current = null
    }, duration)
  }, [duration])

  const showError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setState('error')
    timeoutRef.current = setTimeout(() => {
      setState('idle')
      timeoutRef.current = null
    }, duration)
  }, [duration])

  useEffect(() => reset, [reset])

  return {
    state,
    showSuccess,
    showError,
    reset,
  }
}
import { hapticSoft } from '.'
import { useMessageSinkHapticFeedbackPref } from '../preferences/storages'
import { useCallback } from 'react'

export function useHapticFeedbackMessaging() {
  const [isHaptic] = useMessageSinkHapticFeedbackPref()
  const onNextHaptic = useCallback(() => {
    if (!isHaptic) {
      return
    }
    hapticSoft()
  }, [isHaptic])
  return { isHaptic, onNextHaptic }
}

import { dbFindModeResultWhere } from '../db/table/t-mode-result'
import { TModeResult } from '../db/types'
import { print } from '../printer'
import { useCallback, useEffect, useState } from 'react'

export function useTModeResult(
  mode: string,
  target_lang: string,
  user_content: string
): {
  tModeResult: TModeResult | null | undefined
  refreshTModeResult: () => void
} {
  const [resultMap, setResultMap] = useState<{ [key: string]: TModeResult | null }>({})

  const targetKey = `${mode}_${target_lang}_${user_content}`

  const refreshTModeResult = useCallback(() => {
    dbFindModeResultWhere({ mode, target_lang, user_content })
      .then(value => {
        setResultMap(prev => ({ ...prev, [targetKey]: value }))
      })
      .catch(e => {
        print('dbFindModeResultWhere error', e)
      })
  }, [mode, target_lang, user_content, targetKey])

  useEffect(() => {
    refreshTModeResult()
  }, [mode, target_lang, user_content, targetKey])

  return { tModeResult: resultMap[targetKey], refreshTModeResult }
}

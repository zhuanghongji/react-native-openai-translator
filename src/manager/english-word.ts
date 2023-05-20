import { dbFindModeWordWhere } from '../db/table/t-mode-word'
import { TModeWord } from '../db/types'
import { print } from '../printer'
import { isEnglishWord } from '../utils'
import { useCallback, useEffect, useState } from 'react'

export function useTEnglishWord(
  mode: string,
  target_lang: string,
  user_content: string
): {
  tEnglishWord: TModeWord | null | undefined
  refreshTEnglishWord: () => void
} {
  const [wordMap, setWordMap] = useState<{ [key: string]: TModeWord | null }>({})

  const targetKey = `${mode}_${target_lang}_${user_content}`
  const isTargetValid = user_content && isEnglishWord(user_content) ? true : false

  const refreshTEnglishWord = useCallback(() => {
    if (!isTargetValid) {
      return
    }
    dbFindModeWordWhere({ mode, target_lang, user_content })
      .then(value => {
        setWordMap(prev => ({ ...prev, [targetKey]: value }))
      })
      .catch(e => {
        print('dbFindModeWordWhere error', e)
      })
  }, [mode, target_lang, user_content, targetKey, isTargetValid])

  useEffect(() => {
    refreshTEnglishWord()
  }, [mode, target_lang, user_content, targetKey, isTargetValid])

  return { tEnglishWord: wordMap[targetKey], refreshTEnglishWord }
}

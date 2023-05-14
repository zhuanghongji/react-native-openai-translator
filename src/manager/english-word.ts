import { TEnglishWord, dbFindEnglishWordWhere } from '../db/table/t-english-word'
import { print } from '../printer'
import { isEnglishWord } from '../utils'
import { useCallback, useEffect, useState } from 'react'

export function useTEnglishWord(
  mode: string,
  target_lang: string,
  user_content: string
): {
  tEnglishWord: TEnglishWord | null | undefined
  refreshTEnglishWord: () => void
} {
  const [wordMap, setWordMap] = useState<{ [key: string]: TEnglishWord | null }>({})

  const targetKey = `${mode}_${target_lang}_${user_content}`
  const isTargetValid = user_content && isEnglishWord(user_content) ? true : false

  const refreshTEnglishWord = useCallback(() => {
    if (!isTargetValid) {
      return
    }
    dbFindEnglishWordWhere({ mode, target_lang, user_content })
      .then(value => {
        setWordMap(prev => ({ ...prev, [targetKey]: value }))
      })
      .catch(e => {
        print('dbFindEnglishWordWhere error', e)
      })
  }, [mode, target_lang, user_content, targetKey, isTargetValid])

  useEffect(() => {
    refreshTEnglishWord()
  }, [mode, target_lang, user_content, targetKey, isTargetValid])

  return { tEnglishWord: wordMap[targetKey], refreshTEnglishWord }
}

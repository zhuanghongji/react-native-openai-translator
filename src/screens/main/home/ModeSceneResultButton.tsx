import { BookmarkButton, BookmarkStatus } from '../../../components/BookmarkButton'
import { DEFAULT_T_RESULT_EXTRA } from '../../../db/helper'
import {
  dbFindModeResultWhere,
  dbInsertModeResult,
  dbUpdateModeResultCollectedOfId,
} from '../../../db/table/t-mode-result'
import { TModeResult } from '../../../db/types'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { print } from '../../../printer'
import { ChatCompletionsPrompts } from './prompts'
import React, { useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

type ResultMap = { [key: string]: TModeResult | null }

export type ModeSceneResultButtonProps = {
  style?: StyleProp<ViewStyle>
  mode: TranslatorMode
  targetLang: LanguageKey
  inputText: string
  outputText: string
  prompts: ChatCompletionsPrompts
  isOutputDisabled: boolean
  isInputOrTargetLangChanged: boolean
}

export function ModeSceneResultButton(props: ModeSceneResultButtonProps) {
  const {
    style,
    mode,
    targetLang,
    inputText,
    isOutputDisabled,
    isInputOrTargetLangChanged,
    outputText,
    prompts,
  } = props
  const [trigger, setTrigger] = useState(0)
  const targetKey = `${mode}_${targetLang}_${inputText}`

  const [resultMap, setResultMap] = useState<ResultMap>({})
  const cacheResult = resultMap[targetKey]

  let status: BookmarkStatus = 'added'
  if (cacheResult === undefined) {
    status = 'none'
  } else if (cacheResult === null || cacheResult.collected !== '1') {
    status = 'add'
  }

  const onPress = async () => {
    if (cacheResult === undefined) {
      return
    }
    try {
      if (cacheResult === null) {
        print('dbInsertModeResult')
        await dbInsertModeResult({
          ...DEFAULT_T_RESULT_EXTRA,
          mode,
          target_lang: targetLang,
          user_content: inputText,
          assistant_content: outputText,
          collected: '0',
          system_prompt: prompts.systemPrompt,
          user_prompt_prefix: prompts.userPromptPrefix ?? '',
          user_prompt_suffix: prompts.userPromptSuffix ?? '',
          status: null,
        })
      } else {
        print('dbDeleteModeWordOfId ...')
        const collected = cacheResult.collected === '1'
        await dbUpdateModeResultCollectedOfId(cacheResult.id, !collected)
      }
      setTrigger(prev => prev + 1)
    } catch (e) {
      print('dbInsertModeResult error', e)
    }
  }

  useEffect(() => {
    if (!inputText) {
      return
    }
    dbFindModeResultWhere({ mode, target_lang: targetLang, user_content: inputText })
      .then(value => {
        setResultMap(prev => ({ ...prev, [targetKey]: value }))
      })
      .catch(e => {
        print('dbFindModeResultWhere error', e)
      })
  }, [mode, targetLang, inputText, targetKey, trigger])

  return (
    <BookmarkButton
      style={style}
      status={status}
      disabled={isOutputDisabled || isInputOrTargetLangChanged}
      onPress={onPress}
    />
  )
}

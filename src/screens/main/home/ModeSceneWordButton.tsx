import { HeartButton, HeartStatus } from '../../../components/HeartButton'
import { DEFAULT_T_RESULT_EXTRA } from '../../../db/helper'
import {
  dbFindModeWordWhere,
  dbInsertModeWord,
  dbUpdateModeWordCollectedOfId,
} from '../../../db/table/t-mode-word'
import { TModeWord } from '../../../db/types'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { print } from '../../../printer'
import { ChatCompletionsPrompts } from './prompts'
import React, { useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

type WordMap = { [key: string]: TModeWord | null }

export type ModeSceneWordButtonProps = {
  style?: StyleProp<ViewStyle>
  mode: TranslatorMode
  targetLang: LanguageKey
  inputText: string
  outputText: string
  prompts: ChatCompletionsPrompts
  isOutputDisabled: boolean
  isInputOrTargetLangChanged: boolean
}

export function ModeSceneWordButton(props: ModeSceneWordButtonProps) {
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

  const [wordMap, setWordMap] = useState<WordMap>({})
  const cacheWord = wordMap[targetKey]

  let status: HeartStatus = 'checked'
  if (cacheWord === undefined) {
    status = 'none'
  } else if (cacheWord === null || cacheWord.collected !== '1') {
    status = 'plus'
  }

  const onPress = async () => {
    if (cacheWord === undefined) {
      return
    }
    try {
      if (cacheWord === null) {
        print('dbInsertModeWord ...')
        await dbInsertModeWord({
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
        print('dbUpdateModeWordCollectedOfId ...')
        const collected = cacheWord.collected === '1'
        await dbUpdateModeWordCollectedOfId(cacheWord.id, !collected)
      }
      setTrigger(prev => prev + 1)
    } catch (e) {
      print('onPress error', e)
    }
  }

  useEffect(() => {
    if (!inputText) {
      return
    }
    dbFindModeWordWhere({ mode, target_lang: targetLang, user_content: inputText })
      .then(value => {
        setWordMap(prev => ({ ...prev, [targetKey]: value }))
      })
      .catch(e => {
        print('dbFindModeWordWhere error', e)
      })
  }, [mode, targetLang, inputText, targetKey, trigger])

  return (
    <HeartButton
      style={style}
      status={status}
      disabled={isOutputDisabled || isInputOrTargetLangChanged}
      onPress={onPress}
    />
  )
}

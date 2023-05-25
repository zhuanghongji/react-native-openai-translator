import { SvgIconName } from '../../../components/SvgIcon'
import { ToolButton } from '../../../components/ToolButton'
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
  resultType: string
  isOutputFromCache: boolean
  isOutputDisabled: boolean
  isInputOrTargetLangChanged: boolean
  cacheKey: string
  cacheResult: TModeResult | null | undefined
  setCacheResultMap: React.Dispatch<React.SetStateAction<ResultMap>>
}

export function ModeSceneResultButton(props: ModeSceneResultButtonProps) {
  const {
    style,
    mode,
    targetLang,
    inputText,
    outputText,
    prompts,
    resultType,
    isOutputFromCache,
    isOutputDisabled,
    isInputOrTargetLangChanged,
    cacheKey,
    cacheResult,
    setCacheResultMap,
  } = props

  const [trigger, setTrigger] = useState(0)

  let iconName: SvgIconName = 'bookmark-none'
  if (cacheResult === undefined) {
    iconName = resultType === '1' ? 'heart-none' : 'bookmark-none'
  } else if (cacheResult === null || cacheResult.collected !== '1') {
    iconName = resultType === '1' ? 'heart-plus' : 'bookmark-add'
  } else {
    iconName = resultType === '1' ? 'heart-minus' : 'bookmark-added'
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
          type: resultType,
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
    dbFindModeResultWhere({
      mode,
      target_lang: targetLang,
      user_content: inputText,
      type: resultType,
    })
      .then(value => {
        setCacheResultMap(prev => ({ ...prev, [cacheKey]: value }))
      })
      .catch(e => {
        print('dbFindModeResultWhere error', e)
      })
  }, [mode, targetLang, inputText, resultType, cacheKey, setCacheResultMap, trigger])

  return (
    <ToolButton
      style={style}
      name={iconName}
      disabled={isOutputFromCache ? false : isOutputDisabled || isInputOrTargetLangChanged}
      onPress={onPress}
    />
  )
}

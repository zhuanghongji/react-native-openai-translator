import { SvgIconName } from '../../../components/SvgIcon'
import { ToolButton } from '../../../components/ToolButton'
import { DEFAULT_T_RESULT_EXTRA } from '../../../db/helper'
import {
  dbInsertModeResult,
  dbUpdateModeResultCollectedOfId,
} from '../../../db/table/t-mode-result'
import { TModeResult } from '../../../db/types'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { print } from '../../../printer'
import { QueryKey } from '../../../query/keys'
import { ChatCompletionsPrompts } from './prompts'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export type ModeSceneResultButtonProps = {
  style?: StyleProp<ViewStyle>
  mode: TranslatorMode
  targetLang: LanguageKey
  inputText: string
  outputText: string
  prompts: ChatCompletionsPrompts
  resultType: string
  isOutputDisabled: boolean
  cacheResult: TModeResult | null | undefined
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
    isOutputDisabled,
    cacheResult,
  } = props

  const queryClient = useQueryClient()

  let iconName: SvgIconName = 'bookmark-none'
  if (cacheResult === undefined) {
    iconName = resultType === '1' ? 'heart-none' : 'bookmark-none'
  } else if (cacheResult === null || cacheResult.collected !== '1') {
    iconName = resultType === '1' ? 'heart-plus' : 'bookmark-plus'
  } else {
    iconName = resultType === '1' ? 'heart-minus' : 'bookmark-minus'
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
      queryClient.invalidateQueries({ queryKey: [QueryKey.findModeResultWhere] })
    } catch (e) {
      print('dbInsertModeResult error', e)
    }
  }

  return <ToolButton style={style} name={iconName} disabled={isOutputDisabled} onPress={onPress} />
}

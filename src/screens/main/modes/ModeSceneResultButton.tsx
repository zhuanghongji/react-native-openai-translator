import { SvgIconName } from '../../../components/SvgIcon'
import { ToolButton } from '../../../components/ToolButton'
import { DEFAULT_T_RESULT_EXTRA } from '../../../db/constants'
import { dbInsertModeResult, dbUpdateModeResultValuesOfId } from '../../../db/table/t-mode-result'
import { DBResultSet, TModeResult } from '../../../db/types'
import { hapticSoft, hapticWarning } from '../../../haptic'
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
  let onAction: (() => Promise<DBResultSet<TModeResult>>) | undefined
  if (cacheResult === undefined) {
    iconName = resultType === '1' ? 'heart-none' : 'bookmark-none'
    onAction = undefined
  } else if (cacheResult === null) {
    iconName = resultType === '1' ? 'heart-plus' : 'bookmark-plus'
    onAction = () => {
      return dbInsertModeResult({
        ...DEFAULT_T_RESULT_EXTRA,
        mode,
        target_lang: targetLang,
        user_content: inputText,
        assistant_content: outputText,
        collected: '1',
        system_prompt: prompts.systemPrompt,
        user_prompt_prefix: prompts.userPromptPrefix ?? '',
        user_prompt_suffix: prompts.userPromptSuffix ?? '',
        type: resultType,
        status: null,
      })
    }
  } else if (cacheResult.collected !== '1') {
    iconName = resultType === '1' ? 'heart-plus' : 'bookmark-plus'
    onAction = () => {
      return dbUpdateModeResultValuesOfId(cacheResult.id, {
        assistant_content: outputText,
        collected: '1',
      })
    }
  } else if (cacheResult.assistant_content === outputText) {
    iconName = resultType === '1' ? 'heart-minus' : 'bookmark-minus'
    onAction = () => {
      return dbUpdateModeResultValuesOfId(cacheResult.id, {
        collected: '0',
      })
    }
  } else {
    iconName = 'publish-change'
    onAction = () => {
      return dbUpdateModeResultValuesOfId(cacheResult.id, {
        assistant_content: outputText,
      })
    }
  }

  const onPress = async () => {
    if (!onAction) {
      return
    }
    try {
      hapticSoft()
      await onAction()
      queryClient.invalidateQueries({ queryKey: [QueryKey.findModeResultWhere] })
    } catch (e) {
      hapticWarning()
      print('onPress error', e)
    }
  }

  return <ToolButton style={style} name={iconName} disabled={isOutputDisabled} onPress={onPress} />
}

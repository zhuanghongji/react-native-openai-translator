import { TTSModal, TTSModalHandle } from '../../../components/TTSModal'
import { ToolButton } from '../../../components/ToolButton'
import { DEFAULT_T_RESULT_EXTRA } from '../../../db/constants'
import {
  dbFindModeResultWhere,
  dbInsertModeResult,
  dbUpdateModeResultValuesOfId,
  useQueryFindModeResultWhere,
} from '../../../db/table/t-mode-result'
import { hapticError, hapticSoft, hapticSuccess } from '../../../haptic'
import { useHapticFeedbackMessaging } from '../../../haptic/hooks'
import { useRefetchFocusEffect } from '../../../hooks'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../../http/apis/v1/chat/completions'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { print } from '../../../printer'
import { QueryKey } from '../../../query/keys'
import { dimensions } from '../../../res/dimensions'
import { toast } from '../../../toast'
import { ApiMessage, TranslatorStatus } from '../../../types'
import { isEnglishWord } from '../../../utils'
import { RootStackParamList } from '../../screens'
import { ClipboardDetectedModal } from './ClipboardDetectedModal'
import { InputView, InputViewHandle } from './InputView'
import { ModeSceneResultButton } from './ModeSceneResultButton'
import { OutputView, OutputViewHandle } from './OutputView'
import { StatusDivider } from './StatusDivider'
import { UnsupportTip } from './UnsupportTip'
import { useMessagesWithPrompts } from './prompts'
import Clipboard from '@react-native-clipboard/clipboard'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import EventSource from 'react-native-sse'

export type ModeSceneProps = {
  style?: StyleProp<ViewStyle>
  focused: boolean
  targetLang: LanguageKey
  translatorMode: TranslatorMode
}

export type ModeSceneHandle = {
  inputFocus: () => void
  inputText: (value: string) => void
}

export const ModeScene = React.forwardRef<ModeSceneHandle, ModeSceneProps>((props, ref) => {
  const { style, focused, targetLang, translatorMode } = props
  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const ttsModalRef = useRef<TTSModalHandle>(null)

  // input
  const inputViewRef = useRef<InputViewHandle>(null)
  const [inputText, setInputText] = useState('')
  const { messages: messagesToSend, prompts } = useMessagesWithPrompts({
    targetLang,
    translatorMode,
    inputText,
  })
  const isInputDisabled = inputText ? false : true

  // result type
  const isTranslateMode = translatorMode === 'translate'
  const isInputEnglishWord = isEnglishWord(inputText)
  const resultType = isTranslateMode && isInputEnglishWord ? '1' : '0'

  // result cache
  const queryClient = useQueryClient()
  const cacheQueryResult = useQueryFindModeResultWhere({
    mode: translatorMode,
    target_lang: targetLang,
    user_content: inputText,
    type: resultType,
  })
  const cacheResult = cacheQueryResult.data
  useRefetchFocusEffect(cacheQueryResult.refetch)

  // output
  // assistantText: if null, should output text from cache-result
  const outputViewRef = useRef<OutputViewHandle>(null)
  const [assistantText, setAssistantText] = useState<string | null>(null)
  const outputText = assistantText ?? cacheResult?.assistant_content ?? ''
  const isOutputDisabled = outputText ? false : true

  // observe
  const [prevInputText, setPreInputText] = useState(inputText)
  if (inputText !== prevInputText) {
    setAssistantText(null)
    setPreInputText(inputText)
  }
  const [prevTargetLang, setPreTargetLang] = useState(targetLang)
  if (targetLang !== prevTargetLang) {
    setAssistantText(null)
    setPreTargetLang(targetLang)
  }

  // auto focus after clipboard confirmed
  const clipboardConfirmedRef = useRef(false)
  useEffect(() => {
    if (!clipboardConfirmedRef.current) {
      return
    }
    clipboardConfirmedRef.current = false
    const timer = setTimeout(() => inputViewRef.current?.focus(), 300)
    return () => clearTimeout(timer)
  }, [inputText])

  useImperativeHandle(ref, () => ({
    inputFocus: () => inputViewRef.current?.focus(),
    inputText: setInputText,
  }))

  const performInsertModeResult = (assistant_content: string) => {
    const { systemPrompt, userPromptPrefix, userPromptSuffix } = prompts
    return dbInsertModeResult({
      ...DEFAULT_T_RESULT_EXTRA,
      mode: translatorMode,
      target_lang: targetLang,
      user_content: inputText,
      assistant_content,
      system_prompt: systemPrompt,
      user_prompt_prefix: userPromptPrefix ?? '',
      user_prompt_suffix: userPromptSuffix ?? '',
      collected: '0',
      type: resultType,
      status: null,
    })
  }

  const { onNextHaptic } = useHapticFeedbackMessaging()
  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()
  const [status, setStatus] = useState<TranslatorStatus>('none')

  const eventSourceRef = useRef<EventSource | null>(null)
  const perfromChatCompletions = (messages: ApiMessage[]) => {
    if (!checkIsOptionsValid()) {
      return
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setAssistantText('')
    setStatus('pending')
    eventSourceRef.current = sseRequestChatCompletions(urlOptions, customizedOptions, messages, {
      onNext: content => {
        onNextHaptic()
        outputViewRef.current?.updateText(content)
      },
      onError: (code, message) => {
        setStatus('failure')
        hapticError()
        toast('warning', code, message)
      },
      onDone: message => {
        setAssistantText(message.content)
        setStatus('success')
        hapticSuccess()
        // auto update or insert
        if (cacheResult) {
          dbUpdateModeResultValuesOfId(cacheResult.id, {
            assistant_content: message.content,
          })
            .then(() => {
              print('Auto update mode result success')
              cacheQueryResult.refetch()
            })
            .catch(() => {
              print('Auto update mode result error')
            })
        } else {
          performInsertModeResult(message.content)
            .then(() => {
              print('Auto insert mode result success')
              cacheQueryResult.refetch()
            })
            .catch(() => {
              print('Auto insert mode result error')
            })
        }
      },
      onComplete: () => {
        eventSourceRef.current = null
      },
    })
  }

  const handleChatPress = async () => {
    if (cacheResult === undefined) {
      return
    }
    if (cacheResult !== null) {
      navigation.push('ModeChat', { modeResult: cacheResult })
      return
    }
    try {
      // backup action if auto-insert error
      await performInsertModeResult(outputText)
      const result = await dbFindModeResultWhere({
        mode: translatorMode,
        target_lang: targetLang,
        user_content: inputText,
        type: resultType,
      })
      if (!result) {
        toast('danger', 'Error', 'Create mode result error')
        return
      }
      navigation.push('ModeChat', { modeResult: result })
      queryClient.invalidateQueries({ queryKey: [QueryKey.findModeResultWhere] })
    } catch (e) {
      print('push ModeChat', e)
    }
  }

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <InputView
        ref={inputViewRef}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={() => perfromChatCompletions(messagesToSend)}
      />
      <View style={styles.toolsRow}>
        <ToolButton
          name="compaign"
          disabled={isInputDisabled}
          onPress={() => {
            ttsModalRef.current?.speak({
              content: inputText,
              lang: null,
            })
          }}
        />
        <ToolButton
          name="copy"
          disabled={isInputDisabled}
          onPress={() => {
            hapticSoft()
            Clipboard.setString(inputText)
            toast('success', t('Copied to clipboard'), inputText)
          }}
        />
        <ToolButton
          name="clean"
          disabled={isInputDisabled}
          onPress={() => {
            hapticSoft()
            setStatus('none')
            setInputText('')
            setAssistantText(null)
            inputViewRef.current?.focus()
          }}
        />
      </View>

      <StatusDivider mode={translatorMode} status={status} />
      <ScrollView
        style={{ flex: 1, marginTop: dimensions.edge }}
        contentContainerStyle={{ paddingBottom: dimensions.spaceBottom }}>
        <OutputView
          ref={outputViewRef}
          status={status}
          assistantText={assistantText}
          outputText={outputText}
        />
        <View style={styles.toolsRow}>
          <ModeSceneResultButton
            mode={translatorMode}
            targetLang={targetLang}
            inputText={inputText}
            outputText={outputText}
            prompts={prompts}
            resultType={resultType}
            isOutputDisabled={isOutputDisabled}
            cacheResult={cacheResult}
          />
          <ToolButton
            name="compaign"
            disabled={isOutputDisabled}
            onPress={() => {
              ttsModalRef.current?.speak({
                content: outputText,
                lang: targetLang,
              })
            }}
          />
          <ToolButton
            name="copy"
            disabled={isOutputDisabled}
            onPress={() => {
              hapticSoft()
              Clipboard.setString(outputText)
              toast('success', t('Copied to clipboard'), outputText)
            }}
          />
          <ToolButton name="chat" disabled={isOutputDisabled} onPress={handleChatPress} />
        </View>
        <UnsupportTip />
      </ScrollView>

      <ClipboardDetectedModal
        enabled={focused}
        inputText={inputText}
        outputText={outputText}
        onConfirmPress={text => {
          clipboardConfirmedRef.current = true
          setInputText(text)
        }}
      />
      <TTSModal ref={ttsModalRef} />
    </View>
  )
})

type Styles = {
  container: ViewStyle
  toolsRow: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: '100%',
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 32,
    marginTop: dimensions.edge,
    paddingRight: dimensions.edge,
  },
})

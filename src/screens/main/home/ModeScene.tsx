import { TTSModal, TTSModalHandle } from '../../../components/TTSModal'
import { ToolButton } from '../../../components/ToolButton'
import { DEFAULT_T_RESULT_EXTRA } from '../../../db/helper'
import { dbFindModeResultWhere, dbInsertModeResult } from '../../../db/table/t-mode-result'
import { TModeResult } from '../../../db/types'
import { hapticError, hapticSoft, hapticSuccess } from '../../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../../http/apis/v1/chat/completions'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { print } from '../../../printer'
import { dimensions } from '../../../res/dimensions'
import { toast } from '../../../toast'
import { Message, TranslatorStatus } from '../../../types'
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
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import EventSource from 'react-native-sse'

type CacheResultMap = { [key: string]: TModeResult | null }

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

  const ttsModalRef = useRef<TTSModalHandle>(null)

  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()
  const [status, setStatus] = useState<TranslatorStatus>('none')

  // input
  const inputViewRef = useRef<InputViewHandle>(null)
  const [inputText, setInputText] = useState('')
  const {
    messages: messagesToSend,
    prompts,
    userContent,
  } = useMessagesWithPrompts({
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
  const [cacheResultMap, setCacheResultMap] = useState<CacheResultMap>({})
  const cacheKey = `${translatorMode}_${targetLang}_${inputText}_${resultType}`
  const cacheResult = cacheResultMap[cacheKey]
  const cacheText = cacheResult?.assistant_content ?? ''

  // output
  // assistantText: if null, should output text from cache-result
  const outputViewRef = useRef<OutputViewHandle>(null)
  const [assistantText, setAssistantText] = useState<string | null>(null)
  const isOutputFromCache = assistantText === null
  const outputText = isOutputFromCache ? cacheText : assistantText
  const isOutputDisabled = outputText ? false : true

  // observe
  const [isInputOrTargetLangChanged, setIsInputOrTargetLangChanged] = useState(false)
  const [prevInputText, setPreInputText] = useState(inputText)
  if (inputText !== prevInputText) {
    setIsInputOrTargetLangChanged(true)
    setPreInputText(inputText)
  }
  const [prevTargetLang, setPreTargetLang] = useState(targetLang)
  if (targetLang !== prevTargetLang) {
    setIsInputOrTargetLangChanged(true)
    setPreTargetLang(targetLang)
  }

  // // result icon
  // let resultIconName: SvgIconName = 'bookmark-none'
  // if (cacheResult === undefined) {
  //   resultIconName = resultType === '1' ? 'heart-none' : 'bookmark-none'
  // } else if (cacheResult === null || cacheResult.collected !== '1') {
  //   resultIconName = resultType === '1' ? 'heart-plus' : 'bookmark-add'
  // } else {
  //   resultIconName = resultType === '1' ? 'heart-minus' : 'bookmark-added'
  // }
  // // result funcs
  // const perfromDbFindModeResultWhere = async () => {
  //   try {

  //   } catch
  //   dbFindModeResultWhere({
  //     mode,
  //     target_lang: targetLang,
  //     user_content: inputText,
  //     type: resultType,
  //   })
  //     .then(value => {
  //       setResultMap(prev => ({ ...prev, [targetKey]: value }))
  //     })
  //     .catch(e => {
  //       print('dbFindModeResultWhere error', e)
  //     })
  // }
  // const handleResultIconPress = async () => {
  //   if (cacheResult === undefined) {
  //     return
  //   }
  //   try {
  //     if (cacheResult === null) {
  //       print('dbInsertModeResult')
  //       await dbInsertModeResult({
  //         ...DEFAULT_T_RESULT_EXTRA,
  //         mode: translatorMode,
  //         target_lang: targetLang,
  //         user_content: inputText,
  //         assistant_content: outputText,
  //         collected: '0',
  //         system_prompt: prompts.systemPrompt,
  //         user_prompt_prefix: prompts.userPromptPrefix ?? '',
  //         user_prompt_suffix: prompts.userPromptSuffix ?? '',
  //         type: resultType,
  //         status: null,
  //       })
  //     } else {
  //       print('dbDeleteModeWordOfId ...')
  //       const collected = cacheResult.collected === '1'
  //       await dbUpdateModeResultCollectedOfId(cacheResult.id, !collected)
  //     }
  //   } catch (e) {
  //     print('dbInsertModeResult error', e)
  //   }
  // }

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

  const eventSourceRef = useRef<EventSource | null>(null)
  const perfromChatCompletions = (messages: Message[]) => {
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
        outputViewRef.current?.updateText(content)
      },
      onError: (code, message) => {
        setStatus('failure')
        hapticError()
        toast('warning', code, message)
      },
      onDone: message => {
        setAssistantText(message.content)
        setIsInputOrTargetLangChanged(false)
        setStatus('success')
        hapticSuccess()
      },
      onComplete: () => {
        eventSourceRef.current = null
      },
    })
  }

  const handleChatPress = async () => {
    if (cacheResult) {
      navigation.push('ModeChat', { modeResult: cacheResult })
      return
    }
    try {
      const { systemPrompt, userPromptPrefix, userPromptSuffix } = prompts
      let result = await dbFindModeResultWhere({
        mode: translatorMode,
        target_lang: targetLang,
        user_content: inputText,
        type: resultType,
      })
      if (!result) {
        await dbInsertModeResult({
          ...DEFAULT_T_RESULT_EXTRA,
          mode: translatorMode,
          target_lang: targetLang,
          user_content: inputText,
          assistant_content: outputText,
          system_prompt: systemPrompt,
          user_prompt_prefix: userPromptPrefix ?? '',
          user_prompt_suffix: userPromptSuffix ?? '',
          collected: '0',
          type: resultType,
          status: null,
        })
        result = await dbFindModeResultWhere({
          mode: translatorMode,
          target_lang: targetLang,
          user_content: inputText,
          type: resultType,
        })
      }
      if (!result) {
        toast('danger', 'Error', 'Create mode result error')
        return
      }
      navigation.push('ModeChat', { modeResult: result })
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
        <OutputView ref={outputViewRef} fromCache={isOutputFromCache} text={outputText} />
        <View style={styles.toolsRow}>
          <ModeSceneResultButton
            mode={translatorMode}
            targetLang={targetLang}
            inputText={inputText}
            outputText={outputText}
            prompts={prompts}
            resultType={resultType}
            isOutputFromCache={isOutputFromCache}
            isOutputDisabled={isOutputDisabled}
            isInputOrTargetLangChanged={isInputOrTargetLangChanged}
            cacheKey={cacheKey}
            cacheResult={cacheResult}
            setCacheResultMap={setCacheResultMap}
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
          <ToolButton
            name="chat"
            disabled={isOutputFromCache ? false : isOutputDisabled || isInputOrTargetLangChanged}
            onPress={handleChatPress}
          />
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

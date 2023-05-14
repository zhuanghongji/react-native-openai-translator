import { BookmarkButton, BookmarkStatus } from '../../../components/BookmarkButton'
import { HeartButton, HeartStatus } from '../../../components/HeartButton'
import { TTSModal, TTSModalHandle } from '../../../components/TTSModal'
import { ToolButton } from '../../../components/ToolButton'
import { dbInsertEnglishWord } from '../../../db/table/t-english-word'
import { dbFindModeResultWhere, dbInsertModeResult } from '../../../db/table/t-mode-result'
import { hapticError, hapticSoft, hapticSuccess } from '../../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../../http/apis/v1/chat/completions'
import { useTEnglishWord } from '../../../manager/english-word'
import { useTModeResult } from '../../../manager/mode-result'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { print } from '../../../printer'
import { dimensions } from '../../../res/dimensions'
import { toast } from '../../../toast'
import { Message, TranslatorStatus } from '../../../types'
import { isEnglishWord } from '../../../utils'
import { RootStackParamList } from '../../screens'
import { ClipboardDetectedModal } from './ClipboardDetectedModal'
import { InputView, InputViewHandle } from './InputView'
import { OutputView, OutputViewHandle } from './OutputView'
import { StatusDivider } from './StatusDivider'
import { UnsupportTip } from './UnsupportTip'
import { useMessagesWithPrompts } from './prompts'
import Clipboard from '@react-native-clipboard/clipboard'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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
  const isTranslateMode = translatorMode === 'translate'

  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()
  const [status, setStatus] = useState<TranslatorStatus>('none')

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

  const outputViewRef = useRef<OutputViewHandle>(null)
  const [outputText, setOutputText] = useState('')
  const isOutputDisabled = outputText ? false : true

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

  // English Word
  const isInputEnglishWord = isEnglishWord(inputText)
  const { tEnglishWord, refreshTEnglishWord } = useTEnglishWord(
    translatorMode,
    targetLang,
    inputText
  )
  const onHeartPress = useCallback(async () => {
    try {
      if (tEnglishWord === undefined) {
        return
      }
      if (tEnglishWord === null) {
        print('dbInsertEnglishWord')
        await dbInsertEnglishWord({
          mode: translatorMode,
          target_lang: targetLang,
          user_content: inputText,
          assistant_content: outputText,
          collected: '0',
        })
        refreshTEnglishWord()
      }
      // navigate to detail ?
    } catch (e) {
      print('dbInsertEnglishWord error', e)
    }
  }, [tEnglishWord, refreshTEnglishWord, translatorMode, targetLang, inputText, outputText])
  const heartStatus = useMemo<HeartStatus>(() => {
    if (tEnglishWord === undefined) {
      return 'none'
    }
    if (tEnglishWord === null) {
      return 'plus'
    }
    return 'checked'
  }, [tEnglishWord])

  // Mode Result
  const { tModeResult, refreshTModeResult } = useTModeResult(translatorMode, targetLang, inputText)
  const onBookmarkPress = useCallback(async () => {
    try {
      if (tModeResult === undefined) {
        return
      }
      if (tModeResult === null) {
        print('dbInsertModeResult')
        await dbInsertModeResult({
          mode: translatorMode,
          target_lang: targetLang,
          user_content: inputText,
          assistant_content: outputText,
          collected: '0',
        })
        refreshTModeResult()
      }
      // navigate to detail ?
    } catch (e) {
      print('dbInsertModeResult error', e)
    }
  }, [tModeResult, refreshTModeResult, translatorMode, targetLang, inputText, outputText])
  const bookmarkStatus = useMemo<BookmarkStatus>(() => {
    if (tModeResult === undefined) {
      return 'none'
    }
    if (tModeResult === null) {
      return 'add'
    }
    return 'added'
  }, [tModeResult])

  const ttsModalRef = useRef<TTSModalHandle>(null)

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

  const perfromChatCompletions = (messages: Message[]) => {
    if (!checkIsOptionsValid()) {
      return
    }
    setOutputText('')
    setStatus('pending')
    sseRequestChatCompletions(urlOptions, customizedOptions, messages, {
      onNext: content => {
        outputViewRef.current?.updateText(content)
      },
      onError: (code, message) => {
        setStatus('failure')
        hapticError()
        toast('warning', code, message)
      },
      onDone: message => {
        setOutputText(message.content)
        setIsInputOrTargetLangChanged(false)
        setStatus('success')
        hapticSuccess()
      },
    })
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
            setOutputText('')
            inputViewRef.current?.focus()
          }}
        />
      </View>

      <StatusDivider mode={translatorMode} status={status} />
      <ScrollView
        style={{ flex: 1, marginTop: dimensions.edge }}
        contentContainerStyle={{ paddingBottom: dimensions.spaceBottom }}>
        <OutputView ref={outputViewRef} text={outputText} />
        <View style={styles.toolsRow}>
          {isTranslateMode && isInputEnglishWord ? (
            <HeartButton
              status={heartStatus}
              disabled={isOutputDisabled || isInputOrTargetLangChanged}
              onPress={onHeartPress}
            />
          ) : null}
          <BookmarkButton
            status={bookmarkStatus}
            disabled={isOutputDisabled || isInputOrTargetLangChanged}
            onPress={onBookmarkPress}
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
            disabled={isOutputDisabled || isInputOrTargetLangChanged}
            onPress={async () => {
              const { systemPrompt } = prompts
              try {
                let modeResult = await dbFindModeResultWhere({
                  mode: translatorMode,
                  target_lang: targetLang,
                  user_content: inputText,
                })
                if (!modeResult) {
                  await dbInsertModeResult({
                    mode: translatorMode,
                    target_lang: targetLang,
                    user_content: inputText,
                    assistant_content: outputText,
                    collected: '0',
                  })
                  modeResult = await dbFindModeResultWhere({
                    mode: translatorMode,
                    target_lang: targetLang,
                    user_content: inputText,
                  })
                }
                if (!modeResult) {
                  toast('danger', 'Error', 'Create mode result error')
                  return
                }
                navigation.push('ModeChat', {
                  modeResult,
                  systemPrompt,
                  userContent,
                  assistantContent: outputText,
                })
              } catch (e) {
                print('push ModeChat', e)
              }
            }}
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

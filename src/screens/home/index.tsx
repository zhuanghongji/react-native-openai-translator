import { PickModal } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { TTSModal, TTSModalHandle } from '../../components/TTSModal'
import { hapticError, hapticLight, hapticSuccess } from '../../haptic'
import { usePickModal } from '../../hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import {
  LANGUAGE_KEYS,
  LanguageKey,
  TranslatorMode,
  languageLabelByKey,
} from '../../preferences/options'
import {
  getDefaultFromLanguage,
  getDefaultTargetLanguage,
  getDefaultTranslatorMode,
  getLastDetectedText,
  setLastDetectedText,
  useApiKeyPref,
  useApiUrlPathPref,
  useApiUrlPref,
} from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import { Message, ScanBlock, TranslatorStatus } from '../../types'
import { trimContent } from '../../utils'
import type { RootStackParamList } from '../screens'
import { ClipboardTipModal, ClipboardTipModalHandle } from './ClipboardTipModal'
import { InputView, InputViewHandle } from './InputView'
import { ModeButton } from './ModeButton'
import { OutputView, OutputViewHandle } from './OutputView'
import { PickButton } from './PickButton'
import { StatusDivider } from './StatusDivider'
import { TitleBar } from './TitleBar'
import { ToolButton } from './ToolButton'
import { generateMessagesWithPrompts, useMessagesWithPrompts } from './prompts'
import Clipboard from '@react-native-clipboard/clipboard'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import {
  AppState,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const FROM_LANGUAGE_KEYS = [null, ...LANGUAGE_KEYS]

export function HomeScreen({ navigation }: Props): JSX.Element {
  const tint2 = useThemeColor('tint2')
  const backgroundColor = useThemeColor('background')

  const [apiUrl] = useApiUrlPref()
  const [apiUrlPath] = useApiUrlPathPref()
  const [apiKey] = useApiKeyPref()
  const [status, setStatus] = useState<TranslatorStatus>('none')

  const [fromLangAnimatedIndex, fromLangModalRef] = usePickModal()
  const [fromLang, setFromLang] = useState<LanguageKey | null>(
    getDefaultFromLanguage()
  )
  const fromLangLabel = languageLabelByKey(fromLang)

  const [targetLangAnimatedIndex, targetLangModalRef] = usePickModal()
  const [targetLang, setTargetLang] = useState(getDefaultTargetLanguage)
  const targetLangLabel = languageLabelByKey(targetLang)

  const [translatorMode, setTranslatorMode] = useState(getDefaultTranslatorMode)
  const onTranslatorModeChange = (mode: TranslatorMode) => {
    setTranslatorMode(mode)
    setStatus('none')
  }

  const inputViewRef = useRef<InputViewHandle>(null)
  const [inputText, setInputText] = useState('')
  const {
    messages: messagesToSend,
    prompts,
    userContent,
  } = useMessagesWithPrompts({
    fromLang,
    targetLang,
    translatorMode,
    inputText,
  })
  const hasUserContent = inputText ? true : false

  const outputViewRef = useRef<OutputViewHandle>(null)
  const [outputText, setOutputText] = useState('')
  const ttsModalRef = useRef<TTSModalHandle>(null)

  // Detect text in Clipboard when to be active
  const clipboardTipModalRef = useRef<ClipboardTipModalHandle>(null)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async state => {
      if (state !== 'active') {
        return
      }
      try {
        const _text = await Clipboard.getString()
        const text = trimContent(_text)
        const lastText = getLastDetectedText()
        if (!text || text === lastText || text === outputText) {
          return
        }
        Keyboard.dismiss()
        setLastDetectedText(text)
        clipboardTipModalRef.current?.show({
          text,
          onUseItPress: () => {
            setInputText(text)
            inputViewRef.current?.focus()
          },
        })
      } catch (e) {
        // do nothing
      }
    })
    return () => subscription.remove()
  }, [outputText])

  const onScanSuccess = (blocks: ScanBlock[]) => {
    const content = blocks
      .map(block => block.text)
      .join('\n')
      .trim()
    if (!content) {
      return
    }
    setInputText(content)

    const _langKeys: LanguageKey[] = []
    for (const block of blocks) {
      for (const lang of block.langs) {
        const k = LANGUAGE_KEYS.find(v => v === lang)
        if (k) {
          _langKeys.push(k)
        }
      }
    }
    const langKeys = [...new Set(_langKeys)]
    const nextFromLang = langKeys.length === 1 ? langKeys[0] : null
    setFromLang(nextFromLang)

    const { messages } = generateMessagesWithPrompts({
      fromLang: nextFromLang,
      targetLang,
      translatorMode,
      inputText: content,
    })
    perfromChatCompletions(messages)
  }

  const perfromChatCompletions = (messages: Message[]) => {
    setOutputText('')
    setStatus('pending')
    sseRequestChatCompletions(
      {
        apiUrl,
        apiUrlPath,
        apiKey,
        messages,
      },
      {
        onSubscribe: () => {},
        onNext: content => {
          outputViewRef.current?.updateText(content)
        },
        onTimeout: () => {
          setStatus('failure')
          hapticError()
        },
        onError: message => {
          setStatus('failure')
          hapticError()
        },
        onDone: message => {
          setOutputText(message.content)
          setStatus('success')
          hapticSuccess()
        },
        onComplete: () => {},
      }
    )
  }

  const langsDisabled = translatorMode === 'bubble'
  const exchangeDisabled = fromLang === null || translatorMode !== 'translate'
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar
        onScannerPress={() => {
          Keyboard.dismiss()
          navigation.push('Scanner', { onScanSuccess })
        }}
        onSettingsPress={() => navigation.push('Settings')}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
        }}>
        <PickButton
          style={{ marginLeft: dimensions.edge }}
          disabled={langsDisabled}
          label={fromLangLabel}
          animatedIndex={fromLangAnimatedIndex}
          pickModalRef={fromLangModalRef}
        />
        <Pressable
          style={{ opacity: exchangeDisabled ? dimensions.disabledOpacity : 1 }}
          disabled={exchangeDisabled}
          onPress={() => {
            if (fromLang === null) {
              return
            }
            setFromLang(targetLang)
            setTargetLang(fromLang)
            if (inputText && outputText) {
              setInputText(outputText)
              setOutputText(inputText)
            } else {
              setOutputText('')
            }
          }}>
          <SvgIcon
            style={{ marginHorizontal: 4 }}
            size={dimensions.iconSmall}
            color={tint2}
            name="swap-horiz"
          />
        </Pressable>
        <PickButton
          style={{ marginRight: dimensions.edge }}
          disabled={langsDisabled}
          label={targetLangLabel}
          animatedIndex={targetLangAnimatedIndex}
          pickModalRef={targetLangModalRef}
        />
        <View style={{ flex: 1 }} />
        <View style={styles.modes}>
          <ModeButton
            icon="language"
            mode="translate"
            currentMode={translatorMode}
            onPress={onTranslatorModeChange}
          />
          <ModeButton
            icon="palette"
            mode="polishing"
            currentMode={translatorMode}
            onPress={onTranslatorModeChange}
          />
          <ModeButton
            icon="summarize"
            mode="summarize"
            currentMode={translatorMode}
            onPress={onTranslatorModeChange}
          />
          <ModeButton
            icon="analytics"
            mode="analyze"
            currentMode={translatorMode}
            onPress={onTranslatorModeChange}
          />
          <ModeButton
            icon="bubble"
            mode="bubble"
            currentMode={translatorMode}
            onPress={onTranslatorModeChange}
          />
        </View>
      </View>

      <InputView
        ref={inputViewRef}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={() => perfromChatCompletions(messagesToSend)}
      />
      <View style={styles.toolsRow}>
        <ToolButton
          name="compaign"
          disabled={!hasUserContent}
          onPress={() => {
            ttsModalRef.current?.speak({
              content: inputText,
              lang: fromLang,
            })
          }}
        />
        <ToolButton
          name="copy"
          disabled={!hasUserContent}
          onPress={() => {
            hapticLight()
            Clipboard.setString(inputText)
          }}
        />
        <ToolButton
          name="clean"
          disabled={!hasUserContent}
          onPress={() => {
            hapticLight()
            setStatus('none')
            setInputText('')
            setOutputText('')
            inputViewRef.current?.focus()
          }}
        />
      </View>

      <StatusDivider mode={translatorMode} status={status} />

      <ScrollView style={{ flex: 1, marginTop: dimensions.edge }}>
        <OutputView ref={outputViewRef} text={outputText} />

        <View style={styles.toolsRow}>
          {outputText ? (
            <>
              <ToolButton
                name="compaign"
                onPress={() => {
                  ttsModalRef.current?.speak({
                    content: outputText,
                    lang: targetLang,
                  })
                }}
              />
              <ToolButton
                name="copy"
                onPress={() => {
                  hapticLight()
                  Clipboard.setString(outputText)
                }}
              />
            </>
          ) : null}
          <ToolButton
            name="chat"
            onPress={() => {
              const { systemPrompt } = prompts
              navigation.push('Chat', {
                translatorMode,
                systemPrompt,
                userContent,
                assistantContent: outputText,
              })
            }}
          />
        </View>
      </ScrollView>

      <PickModal
        ref={fromLangModalRef}
        value={fromLang}
        values={FROM_LANGUAGE_KEYS}
        animatedIndex={fromLangAnimatedIndex}
        valueToLabel={languageLabelByKey}
        onValueChange={setFromLang}
        onDismiss={({ wasKeyboardVisibleWhenShowing }) => {
          wasKeyboardVisibleWhenShowing && inputViewRef.current?.focus()
        }}
      />
      <PickModal
        ref={targetLangModalRef}
        value={targetLang}
        values={LANGUAGE_KEYS}
        animatedIndex={targetLangAnimatedIndex}
        valueToLabel={languageLabelByKey}
        onValueChange={setTargetLang}
        onDismiss={({ wasKeyboardVisibleWhenShowing }) => {
          wasKeyboardVisibleWhenShowing && inputViewRef.current?.focus()
        }}
      />
      <ClipboardTipModal ref={clipboardTipModalRef} />
      <TTSModal ref={ttsModalRef} />
    </SafeAreaView>
  )
}

type Styles = {
  modes: ViewStyle
  toolsRow: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  modes: {
    flexDirection: 'row',
    gap: dimensions.gap,
    marginRight: dimensions.edge,
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

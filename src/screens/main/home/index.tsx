import { PickSelector } from '../../../components/PickSelector'
import { SvgIcon } from '../../../components/SvgIcon'
import { TTSModal, TTSModalHandle } from '../../../components/TTSModal'
import { hapticError, hapticSoft, hapticSuccess } from '../../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../../http/apis/v1/chat/completions'
import {
  LANGUAGE_KEYS,
  LanguageKey,
  TranslatorMode,
  languageLabelByKey,
} from '../../../preferences/options'
import { getDefaultTargetLanguage, getDefaultTranslatorMode } from '../../../preferences/storages'
import { dimensions } from '../../../res/dimensions'
import { useThemeColor } from '../../../themes/hooks'
import { toast } from '../../../toast'
import { Message, ScanBlock, TranslatorStatus } from '../../../types'
import type { RootStackParamList } from '../../screens'
import { ClipboardDetectedModal } from './ClipboardDetectedModal'
import { InputView, InputViewHandle } from './InputView'
import { ModeButton } from './ModeButton'
import { OutputView, OutputViewHandle } from './OutputView'
import { PickView } from './PickView'
import { StatusDivider } from './StatusDivider'
import { TitleBar } from './TitleBar'
import { ToolButton } from './ToolButton'
import { UnsupportTip } from './UnsupportTip'
import { useMessagesWithPrompts } from './prompts'
import Clipboard from '@react-native-clipboard/clipboard'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const FROM_LANGUAGE_KEYS = [null, ...LANGUAGE_KEYS]

export function HomeScreen({ navigation }: Props): JSX.Element {
  const tint2 = useThemeColor('tint2')
  const backgroundColor = useThemeColor('background')
  const { t } = useTranslation()

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()
  const [status, setStatus] = useState<TranslatorStatus>('none')

  const [fromLang, setFromLang] = useState<LanguageKey | null>(null)
  const [targetLang, setTargetLang] = useState(getDefaultTargetLanguage)

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

  // auto focus after scan success
  const scanSuccessRef = useRef(false)
  useEffect(() => {
    if (!scanSuccessRef.current) {
      return
    }
    scanSuccessRef.current = false
    const timer = setTimeout(() => {
      inputViewRef.current?.focus()
    }, 300)
    return () => clearTimeout(timer)
  }, [inputText])

  const onScanSuccess = (blocks: ScanBlock[]) => {
    const content = blocks
      .map(block => block.text)
      .join('\n')
      .trim()
    if (!content) {
      return
    }
    scanSuccessRef.current = true
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
  }

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
        setStatus('success')
        hapticSuccess()
      },
    })
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
        <PickSelector
          style={{ marginLeft: dimensions.edge }}
          labelStyle={styles.pickLabel}
          value={fromLang}
          values={FROM_LANGUAGE_KEYS}
          disabled={langsDisabled}
          valueToLabel={languageLabelByKey}
          renderContent={({ label, anim }) => <PickView anim={anim} label={label} />}
          onValueChange={setFromLang}
          onDismiss={({ wasKeyboardVisibleWhenShowing }) => {
            wasKeyboardVisibleWhenShowing && inputViewRef.current?.focus()
          }}
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
        <PickSelector
          style={{ marginRight: dimensions.edge }}
          labelStyle={styles.pickLabel}
          value={targetLang}
          values={LANGUAGE_KEYS}
          disabled={langsDisabled}
          valueToLabel={languageLabelByKey}
          renderContent={({ label, anim }) => <PickView anim={anim} label={label} />}
          onValueChange={setTargetLang}
          onDismiss={({ wasKeyboardVisibleWhenShowing }) => {
            wasKeyboardVisibleWhenShowing && inputViewRef.current?.focus()
          }}
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
            hapticSoft()
            Clipboard.setString(inputText)
            toast('success', t('Copied to clipboard'), inputText)
          }}
        />
        <ToolButton
          name="clean"
          disabled={!hasUserContent}
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
                  hapticSoft()
                  Clipboard.setString(outputText)
                  toast('success', t('Copied to clipboard'), outputText)
                }}
              />
            </>
          ) : null}
          <ToolButton
            name="chat"
            onPress={() => {
              const { systemPrompt } = prompts
              navigation.push('ModeChat', {
                translatorMode,
                systemPrompt,
                userContent,
                assistantContent: outputText,
              })
            }}
          />
        </View>
        <UnsupportTip />
      </ScrollView>

      <ClipboardDetectedModal
        inputText={inputText}
        outputText={outputText}
        onConfirmPress={text => {
          setInputText(text)
          inputViewRef.current?.focus()
        }}
      />
      <TTSModal ref={ttsModalRef} />
    </SafeAreaView>
  )
}

type Styles = {
  modes: ViewStyle
  toolsRow: ViewStyle
  pickLabel: TextStyle
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
  pickLabel: {
    fontSize: 11,
    marginHorizontal: 6,
  },
})

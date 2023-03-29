import { PickModal } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { usePickModal } from '../../hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import {
  LANGUAGE_KEYS,
  TranslateMode,
  languageLabelByKey,
} from '../../preferences/options'
import {
  getDefaultTargetLanguage,
  getDefaultTranslateMode,
  useApiKeyPref,
  useApiUrlPathPref,
  useApiUrlPref,
  useFromLanguagePref,
} from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useImageThemeColor, useViewThemeColor } from '../../themes/hooks'
import { TranslatorStatus } from '../../types'
import { InputView, InputViewHandle } from './InputView'
import { ModeButton } from './ModeButton'
import { OutputView, OutputViewHandle } from './OutputView'
import { PickButton } from './PickButton'
import { StatusDivider } from './StatusDivider'
import { TitleBar } from './TitleBar'
import { ToolButton } from './ToolButton'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export function HomeScreen({ navigation }: Props): JSX.Element {
  const tintSecondary = useImageThemeColor('tintSecondary')
  const backgroundColor = useViewThemeColor('background')

  const [apiUrl] = useApiUrlPref()
  const [apiUrlPath] = useApiUrlPathPref()
  const [apiKey] = useApiKeyPref()
  const [status, setStatus] = useState<TranslatorStatus>('none')

  const [fromLangAnimatedIndex, fromLangModalRef] = usePickModal()
  const [fromLang, setFromLang] = useFromLanguagePref()
  const fromLangLabel = languageLabelByKey(fromLang)

  const [targetLangAnimatedIndex, targetLangModalRef] = usePickModal()
  const [targetLang, setTargetLang] = useState(getDefaultTargetLanguage)
  const targetLangLabel = languageLabelByKey(targetLang)

  const [translateMode, setTranslateMode] = useState(getDefaultTranslateMode)
  const onTranslateModeChange = (mode: TranslateMode) => {
    setTranslateMode(mode)
    setStatus('none')
  }

  const [userContent, setUserContent] = useState('')
  const [assistantContent, setAssistantContent] = useState('')

  const inputViewRef = useRef<InputViewHandle>(null)
  const outputViewRef = useRef<OutputViewHandle>(null)

  const onSubmitEditing = (text: string) => {
    outputViewRef.current?.setContent('')
    setAssistantContent('')
    setStatus('pending')
    sseRequestChatCompletions(
      {
        apiUrl,
        apiUrlPath,
        apiKey,
        fromLang,
        targetLang,
        translateMode,
        userContent: text,
      },
      {
        onSubscribe: () => {},
        onNext: content => {
          outputViewRef.current?.setContent(content)
        },
        onTimeout: () => {
          setStatus('failure')
        },
        onError: message => {
          setStatus('failure')
        },
        onDone: message => {
          outputViewRef.current?.setContent(message.content)
          setAssistantContent(message.content)
          setStatus('success')
        },
        onComplete: () => {},
      }
    )
  }

  const langsDisabled = translateMode === 'bubble'
  const langsOpacity = langsDisabled ? 0.3 : 1
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar onSettingsPress={() => navigation.push('Settings')} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <PickButton
          style={{ marginLeft: dimensions.edge, opacity: langsOpacity }}
          disabled={langsDisabled}
          label={fromLangLabel}
          animatedIndex={fromLangAnimatedIndex}
          pickModalRef={fromLangModalRef}
        />
        <Pressable
          style={{ opacity: langsOpacity }}
          disabled={langsDisabled}
          onPress={() => {
            setFromLang(targetLang)
            setTargetLang(fromLang)
          }}>
          <SvgIcon
            style={{ marginHorizontal: 4 }}
            size={dimensions.iconSmall}
            color={tintSecondary}
            name="swap-horiz"
          />
        </Pressable>
        <PickButton
          style={{ marginRight: dimensions.edge, opacity: langsOpacity }}
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
            currentMode={translateMode}
            onPress={onTranslateModeChange}
          />
          <ModeButton
            icon="palette"
            mode="polishing"
            currentMode={translateMode}
            onPress={onTranslateModeChange}
          />
          <ModeButton
            icon="summarize"
            mode="summarize"
            currentMode={translateMode}
            onPress={onTranslateModeChange}
          />
          <ModeButton
            icon="analytics"
            mode="analyze"
            currentMode={translateMode}
            onPress={onTranslateModeChange}
          />
          <ModeButton
            icon="bubble"
            mode="bubble"
            currentMode={translateMode}
            onPress={onTranslateModeChange}
          />
        </View>
      </View>

      <InputView
        ref={inputViewRef}
        value={userContent}
        onChangeText={setUserContent}
        onSubmitEditing={onSubmitEditing}
      />
      <View style={styles.toolsRow}>
        <ToolButton name="compaign" onPress={() => {}} />
        <ToolButton name="copy" onPress={() => {}} />
      </View>

      <StatusDivider mode={translateMode} status={status} />

      <ScrollView style={{ flex: 1, marginTop: dimensions.edge }}>
        <OutputView ref={outputViewRef} />
        {assistantContent ? (
          <View style={styles.toolsRow}>
            <ToolButton name="compaign" onPress={() => {}} />
            <ToolButton name="copy" onPress={() => {}} />
          </View>
        ) : null}
      </ScrollView>

      <PickModal
        ref={fromLangModalRef}
        value={fromLang}
        values={LANGUAGE_KEYS}
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

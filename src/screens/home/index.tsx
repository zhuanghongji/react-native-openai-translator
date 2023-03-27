import { PickModal } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { usePickModal } from '../../hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { LANGUAGE_KEYS, languageLabelByKey } from '../../preferences/options'
import {
  getDefaultTargetLanguage,
  getDefaultTranslateMode,
  useApiKeyPref,
  useFromLanguagePref,
} from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useImageThemeColor, useViewThemeColor } from '../../themes/hooks'
import { InputView } from './InputView'
import { ModeButton } from './ModeButton'
import { OutputText, OutputTextHandle } from './OutputText'
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
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export function HomeScreen({ navigation }: Props): JSX.Element {
  const tintSecondary = useImageThemeColor('tintSecondary')
  const backgroundColor = useViewThemeColor('background')

  const [fromLangAnimatedIndex, fromLangModalRef] = usePickModal()
  const [fromLang, setFromLang] = useFromLanguagePref()
  const fromLangLabel = languageLabelByKey(fromLang)

  const [targetLangAnimatedIndex, targetLangModalRef] = usePickModal()
  const [targetLang, setTargetLang] = useState(getDefaultTargetLanguage)
  const targetLangLabel = languageLabelByKey(targetLang)

  const [translateMode, setTranslateMode] = useState(getDefaultTranslateMode)

  const [userContent, setUserContent] = useState('')
  const [apiKey] = useApiKeyPref()

  const outputTextRef = useRef<OutputTextHandle>(null)
  const [assistantContent, setAssistantContent] = useState('')
  const assistantContentAnim = useSharedValue('123')
  if (!userContent && assistantContent) {
    setAssistantContent('')
    assistantContentAnim.value = ''
  }

  const onSubmitEditing = (text: string) => {
    sseRequestChatCompletions(
      {
        url: 'https://api.openai.com/v1/chat/completions',
        userContent: text,
        apiKey,
      },
      {
        onSubscribe: () => {},
        onNext: content => {
          outputTextRef.current?.setValue(content)
        },
        onDone: message => {
          outputTextRef.current?.setValue(message.content)
        },
        onTimeout: () => {},
        onError: message => {},
        onComplete: () => {},
      }
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar onSettingsPress={() => navigation.push('Settings')} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PickButton
          style={{ marginLeft: dimensions.edge }}
          label={fromLangLabel}
          animatedIndex={fromLangAnimatedIndex}
          pickModalRef={fromLangModalRef}
        />
        <Pressable
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
          style={{ marginRight: dimensions.edge }}
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
            onPress={setTranslateMode}
          />
          <ModeButton
            icon="palette"
            mode="polishing"
            currentMode={translateMode}
            onPress={setTranslateMode}
          />
          <ModeButton
            icon="summarize"
            mode="summarize"
            currentMode={translateMode}
            onPress={setTranslateMode}
          />
          <ModeButton
            icon="analytics"
            mode="analyze"
            currentMode={translateMode}
            onPress={setTranslateMode}
          />
          <ModeButton
            icon="code"
            mode="explain-code"
            currentMode={translateMode}
            onPress={setTranslateMode}
          />
        </View>
      </View>

      <InputView
        value={userContent}
        onChangeText={setUserContent}
        onSubmitEditing={onSubmitEditing}
      />
      <View style={styles.toolsRow}>
        <ToolButton name="compaign" onPress={() => {}} />
        <ToolButton name="copy" onPress={() => {}} />
      </View>

      <StatusDivider mode="analyze" status="success" />

      <ScrollView style={{ flex: 1, marginTop: dimensions.edge }}>
        <OutputText ref={outputTextRef} />
        <View>
          <View style={styles.toolsRow}>
            <ToolButton name="compaign" onPress={() => {}} />
            <ToolButton name="copy" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>

      <PickModal
        ref={fromLangModalRef}
        value={fromLang}
        values={LANGUAGE_KEYS}
        animatedIndex={fromLangAnimatedIndex}
        valueToLabel={languageLabelByKey}
        onValueChange={setFromLang}
      />
      <PickModal
        ref={targetLangModalRef}
        value={targetLang}
        values={LANGUAGE_KEYS}
        animatedIndex={targetLangAnimatedIndex}
        valueToLabel={languageLabelByKey}
        onValueChange={setTargetLang}
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

import { PickModal, PickModalHandle } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { dimensions } from '../../res/dimensions'
import { LANGUAGE_KEYS, LanguageKey, languageNameByKey } from '../../res/langs'
import { TranslateMode } from '../../res/settings'
import {
  useImageThemeColor,
  useTextThemeColor,
  useViewThemeColor,
} from '../../themes/hooks'
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
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export function HomeScreen({ navigation }: Props): JSX.Element {
  const textColor = useTextThemeColor('text')
  const tintSecondary = useImageThemeColor('tintSecondary')
  const backgroundColor = useViewThemeColor('background')

  const fromLangAnimatedIndex = useSharedValue(-1)
  const fromLangModalRef = useRef<PickModalHandle>(null)
  const [fromLangKey, setFromLangKey] = useState<LanguageKey>('en')
  const fromLangName = languageNameByKey(fromLangKey)

  const toLangAnimatedIndex = useSharedValue(-1)
  const toLangModalRef = useRef<PickModalHandle>(null)
  const [toLangKey, setToLangKey] = useState<LanguageKey>('zh-Hans')
  const toLangName = languageNameByKey(toLangKey)

  const [translateMode, setTranslateMode] = useState<TranslateMode>('translate')

  const [userContent, setUserContent] = useState('')

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
        apiKey: '',
      },
      {
        onSubscribe: () => {},
        onNext: content => {
          // setAssistantContent(content)
          // assistantContentAnim.value = content
          outputTextRef.current?.setValue(content)
        },
        onDone: message => {
          // setAssistantContent(message.content)
          // assistantContentAnim.value = message.content
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
          text={fromLangName}
          animatedIndex={fromLangAnimatedIndex}
          pickModalRef={fromLangModalRef}
        />
        <Pressable
          onPress={() => {
            setFromLangKey(toLangKey)
            setToLangKey(fromLangKey)
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
          text={toLangName}
          animatedIndex={toLangAnimatedIndex}
          pickModalRef={toLangModalRef}
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
        {/* <Text style={[styles.outputText, { color: textColor }]}>
          {assistantContent}
        </Text> */}
        {/* <RText
          style={[styles.outputText, { color: textColor }]}
          value={assistantContentAnim}
        /> */}
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
        value={fromLangKey}
        values={LANGUAGE_KEYS}
        animatedIndex={fromLangAnimatedIndex}
        valueToString={languageNameByKey}
        onValueChange={setFromLangKey}
      />
      <PickModal
        ref={toLangModalRef}
        value={toLangKey}
        values={LANGUAGE_KEYS}
        animatedIndex={toLangAnimatedIndex}
        valueToString={languageNameByKey}
        onValueChange={setToLangKey}
      />
    </SafeAreaView>
  )
}

type Styles = {
  modes: ViewStyle
  toolsRow: ViewStyle
  outputText: TextStyle
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
  outputText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
    marginHorizontal: dimensions.edge * 2,
  },
})

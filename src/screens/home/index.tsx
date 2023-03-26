import { PickModal, PickModalHandle } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { LANGUAGE_KEYS, LanguageKey, languageNameByKey } from '../../res/langs'
import { TranslateMode } from '../../res/settings'
import { texts } from '../../res/texts'
import {
  useImageThemeColor,
  useTextThemeColor,
  useViewThemeColor,
} from '../../themes/hooks'
import { InputView } from './InputView'
import { ModeButton } from './ModeButton'
import { PickButton } from './PickButton'
import { StatusDivider } from './StatusDivider'
import { TitleBar } from './TitleBar'
import { ToolButton } from './ToolButton'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
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

  const [inputValue, setInputValue] = useState('')
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
        <TouchableOpacity
          activeOpacity={1.0}
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
        </TouchableOpacity>
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

      <InputView value={inputValue} onChangeText={setInputValue} />
      <View style={styles.toolsRow}>
        <ToolButton name="compaign" onPress={() => {}} />
        <ToolButton name="copy" onPress={() => {}} />
      </View>

      <StatusDivider mode="analyze" status="success" />

      <ScrollView style={{ flex: 1, marginTop: dimensions.edge }}>
        <Text style={[styles.outputText, { color: textColor }]}>
          {texts.lorem}
        </Text>
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

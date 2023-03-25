import { SvgIcon } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
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
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export function HomeScreen({ navigation }: Props): JSX.Element {
  const textColor = useTextThemeColor('text')
  const tintSecondary = useImageThemeColor('tintSecondary')
  const backgroundColor = useViewThemeColor('background')

  const [inputValue, setInputValue] = useState('')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar onSettingsPress={() => navigation.push('Settings')} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PickButton
          style={{ marginLeft: dimensions.edge }}
          text="English"
          picking={false}
          onPress={() => {}}
        />
        <SvgIcon
          style={{ marginHorizontal: 4 }}
          size={dimensions.iconSmall}
          color={tintSecondary}
          name="swap-horiz"
        />
        <PickButton
          style={{ marginRight: dimensions.edge }}
          text="中文"
          picking={false}
          onPress={() => {}}
        />
        <View style={{ flex: 1 }} />
        <View style={styles.modes}>
          <ModeButton name="language" selected={false} onPress={() => {}} />
          <ModeButton name="palette" selected={false} onPress={() => {}} />
          <ModeButton name="summarize" selected={false} onPress={() => {}} />
          <ModeButton name="analytics" selected={false} onPress={() => {}} />
          <ModeButton name="code" selected={false} onPress={() => {}} />
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

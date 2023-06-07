import { SvgIcon } from '../../components/SvgIcon'
import { useApiKeyPref, useLanguageModePref } from '../../preferences/storages'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { useThemeScheme, useThemeSelector } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { BottomView } from './BottomView'
import { BrandView } from './BrandView'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useMemo } from 'react'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import {
  Easing,
  WithTimingConfig,
  runOnJS,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'ApiKeys'>

const c1 = '#0102F5'
const bc1 = '#FCF1DB'
const c2 = '#EAF0FE'
const bc2 = '#393327'
const c3 = '#F092F9'
const bc3 = '#E3FEDC'
const c4 = '#A8CACA'
const bc4 = '#1D073A'

const DELAY = 2000
const WITH_EXPAND: WithTimingConfig = {
  duration: 1200,
  easing: Easing.inOut(Easing.ease),
}
const WITH_COLLAPSE: WithTimingConfig = {
  duration: 600,
  easing: Easing.cubic,
}

type Item = {
  text: string
  color: string
  backgroundColor: string
}

export function ApiKeysScreen({ navigation, route }: Props): JSX.Element {
  const fromSettings = route.params?.fromSettings ? true : false

  const { backgroundChat: backgroundColor } = useThemeScheme()
  const _tint = useThemeSelector(colors.white, colors.black)
  const tint = fromSettings ? colors.black : _tint

  const { top } = useSafeAreaInsets()

  const [apiKey, setApiKey] = useApiKeyPref()

  const anim = useSharedValue(0)
  const startAnim = () => {
    anim.value = 0
    anim.value = withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(0.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(1, WITH_COLLAPSE)),
      withTiming(1.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(2, WITH_COLLAPSE)),
      withTiming(2.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(3, WITH_COLLAPSE)),
      withTiming(3.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(4, WITH_COLLAPSE)),
      withTiming(4.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(5, WITH_COLLAPSE)),
      withTiming(5.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(6, WITH_COLLAPSE)),
      withTiming(6.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(7, WITH_COLLAPSE)),
      withTiming(7.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(8, WITH_COLLAPSE)),
      withTiming(8.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(9, WITH_COLLAPSE)),
      withTiming(9.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(10, WITH_COLLAPSE)),
      withTiming(10.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(11, WITH_COLLAPSE)),
      withTiming(11.5, WITH_EXPAND),
      withDelay(DELAY, withTiming(12, WITH_COLLAPSE)),
      withTiming(13, { duration: 300 }, finished => {
        finished && runOnJS(startAnim)()
      })
    )
  }
  useEffect(() => {
    startAnim()
  }, [])

  const [langMode] = useLanguageModePref()
  const items = useMemo<Item[]>(() => {
    const isEn = langMode === 'en'
    return [
      { text: isEn ? 'Let’s design' : '让我们一起设计', color: c1, backgroundColor: bc1 },
      { text: isEn ? 'Let’s chit-chat' : '让我们一起闲聊', color: c2, backgroundColor: bc2 },
      { text: isEn ? 'Let’s discover' : '让我们一起发现', color: c3, backgroundColor: bc3 },
      { text: 'ChatGPT', color: c4, backgroundColor: bc4 },

      { text: isEn ? 'Let’s create' : '让我们一起创造', color: c1, backgroundColor: bc1 },
      { text: isEn ? 'Let’s brainstorm' : '让我们一起头脑风暴', color: c2, backgroundColor: bc2 },
      { text: isEn ? 'Let’s go' : '让我们一起启程', color: c3, backgroundColor: bc3 },
      { text: 'ChatGPT', color: c4, backgroundColor: bc4 },

      { text: isEn ? 'Let’s explore' : '让我们一起探索', color: c1, backgroundColor: bc1 },
      { text: isEn ? 'Let’s collaborate' : '让我们一起合作', color: c2, backgroundColor: bc2 },
      { text: isEn ? 'Let’s invent' : '让我们一起发明', color: c3, backgroundColor: bc3 },
      { text: 'ChatGPT', color: c4, backgroundColor: bc4 },

      { text: '', color: c1, backgroundColor: bc1 },
    ]
  }, [langMode])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <View style={stylez.f1}>
        <BrandView key={langMode} anim={anim} items={items} />
        {/* position: absoulte */}
        <BottomView
          apiKey={apiKey}
          onChangeApiKey={value => {
            setApiKey(value)
            navigation.goBack()
          }}
        />
        <Pressable style={[styles.close, { top }]} onPress={() => navigation.goBack()}>
          <SvgIcon size={dimensions.iconLarge} color={tint} name="close" />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

type Styles = {
  close: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  close: {
    position: 'absolute',
    right: 0,
    width: dimensions.barHeight,
    height: dimensions.barHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

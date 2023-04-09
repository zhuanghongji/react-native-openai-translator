import { TText } from '../../components/TText'
import { TranslatorMode } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import { TranslatorStatus } from '../../types'
import React, { useEffect } from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

type StatusText = Record<TranslatorStatus, string>

const STATUS_TEXTS: Record<TranslatorMode, StatusText> = {
  translate: {
    none: 'Translate Mode',
    pending: 'Translating...',
    failure: 'Translate failed',
    success: 'Translated',
  },
  polishing: {
    none: 'Polishing Mode',
    pending: 'Polishing...',
    failure: 'Polishing failed',
    success: 'Polished',
  },
  summarize: {
    none: 'Summarize Mode',
    pending: 'Summarizing...',
    failure: 'Summarize failed',
    success: 'Summarized',
  },
  analyze: {
    none: 'Analyze Mode',
    pending: 'Analyzing...',
    failure: 'Analyze failed',
    success: 'Analyzed',
  },
  bubble: {
    none: 'Bubble Mode',
    pending: 'Bubbling...',
    failure: 'Bubble failed',
    success: 'Bubbled',
  },
}

const STATUS_EMOJIS: Record<TranslatorStatus, string> = {
  none: '',
  pending: '✍️',
  failure: '😢',
  success: '👍',
}

export interface StatusDividerProps {
  mode: TranslatorMode
  status: TranslatorStatus
}

export function StatusDivider(props: StatusDividerProps): JSX.Element {
  const { mode, status } = props
  const text = STATUS_TEXTS[mode][status]
  const emoji = STATUS_EMOJIS[status]

  const contentColor = useThemeColor('text2')
  const backgroundColor = useThemeColor('backdrop2')
  const backgroundStyle: ViewStyle = {
    backgroundColor,
  }

  const anim = useSharedValue(0.5)
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(anim.value, [0, 0.5, 1], [-3, 0, 3], Extrapolation.CLAMP),
        },
      ],
    }
  })
  useEffect(() => {
    if (status === 'pending') {
      anim.value = withRepeat(withTiming(1), -1, true)
      return
    }
    anim.value = withTiming(0.5)
  }, [status, anim])

  return (
    <View style={styles.container}>
      <View style={[styles.divider, backgroundStyle]} />
      <View
        style={[
          styles.statusRow,
          { justifyContent: status === 'none' ? 'center' : 'space-between' },
          backgroundStyle,
        ]}>
        <TText style={[styles.statusText, { color: contentColor }]} typo="text2">
          {text}
        </TText>
        <Animated.Text style={[styles.statusEmoji, animStyle]}>{emoji}</Animated.Text>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  divider: ViewStyle
  statusRow: ViewStyle
  statusText: TextStyle
  statusEmoji: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dimensions.edge,
  },
  divider: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'red',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: 120,
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
  },
  statusEmoji: {
    fontSize: 11,
  },
})

import { TranslatorMode } from '../../../preferences/options'
import { dimensions } from '../../../res/dimensions'
import { TText } from '../../../themes/TText'
import { useThemeScheme } from '../../../themes/hooks'
import { TranslatorStatus } from '../../../types'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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

  const { t } = useTranslation()

  const statusTexts: Record<TranslatorMode, StatusText> = {
    translate: {
      none: t('Translate Mode'),
      pending: t('Translating...'),
      failure: t('Translate failed'),
      success: t('Translated'),
    },
    polishing: {
      none: t('Polishing Mode'),
      pending: t('Polishing...'),
      failure: t('Polishing failed'),
      success: t('Polished'),
    },
    summarize: {
      none: t('Summarize Mode'),
      pending: t('Summarizing...'),
      failure: t('Summarize failed'),
      success: t('Summarized'),
    },
    analyze: {
      none: t('Analyze Mode'),
      pending: t('Analyzing...'),
      failure: t('Analyze failed'),
      success: t('Analyzed'),
    },
    bubble: {
      none: t('Bubble Mode'),
      pending: t('Bubbling...'),
      failure: t('Bubble failed'),
      success: t('Bubbled'),
    },
  }
  const text = statusTexts[mode][status]
  const emoji = STATUS_EMOJIS[status]

  const { text2: contentColor, backdrop2: backgroundColor } = useThemeScheme()
  const backgroundStyle: ViewStyle = { backgroundColor }

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

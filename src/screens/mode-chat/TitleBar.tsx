import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { TranslatorMode } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { useStatusBarStyle, useThemeColor } from '../../themes/hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StatusBar, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarProps {
  mode: TranslatorMode
  systemPrompt: string
  onBackPress: () => void
}

const H_EDGE = 8

function useTitle(mode: TranslatorMode) {
  const { t } = useTranslation()
  if (mode === 'translate') {
    return t('Translate Chat')
  }
  if (mode === 'polishing') {
    return t('Polishing Chat')
  }
  if (mode === 'summarize') {
    return t('Summarize Chat')
  }
  if (mode === 'analyze') {
    return t('Analyze Chat')
  }
  return t('Bubble Chat')
}

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { mode, systemPrompt, onBackPress } = props
  const { top } = useSafeAreaInsets()

  const title = useTitle(mode)

  const barStyle = useStatusBarStyle()
  const tintColor = useThemeColor('tint')
  const backgroundColor = useThemeColor('backgroundChat')

  return (
    <View style={[styles.container, { height: dimensions.barHeight + top, paddingTop: top }]}>
      <StatusBar translucent barStyle={barStyle} backgroundColor={backgroundColor} />
      <Pressable style={styles.touchable} hitSlop={{ right: H_EDGE }} onPress={onBackPress}>
        <SvgIcon size={dimensions.iconMedium} color={tintColor} name="back" />
      </Pressable>
      <View style={styles.center}>
        <TText style={styles.title} typo="text">
          {title}
        </TText>
        {systemPrompt ? (
          <TText style={styles.subtitle} numberOfLines={1} typo="text2">
            {systemPrompt}
          </TText>
        ) : null}
      </View>
      <View style={styles.touchable} />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  touchable: ViewStyle
  center: ViewStyle
  title: TextStyle
  subtitle: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_EDGE,
    width: '100%',
  },
  touchable: {
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  subtitle: {
    fontSize: 12,
  },
})

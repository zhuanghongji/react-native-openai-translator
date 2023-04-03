import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { TranslatorMode } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import React from 'react'
import {
  Pressable,
  StatusBar,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarProps {
  mode: TranslatorMode
  systemPrompt: string
  onBackPress: () => void
  onMorePress: () => void
}

const H_EDGE = 8

function getTitle(mode: TranslatorMode) {
  if (mode === 'translate') {
    return 'Translate Chat'
  }
  if (mode === 'polishing') {
    return 'Polishing Chat'
  }
  if (mode === 'summarize') {
    return 'Summarize Chat'
  }
  if (mode === 'analyze') {
    return 'Analyze Chat'
  }
  return 'Bubble Chat'
}

function getSubtitle(mode: TranslatorMode, systemPrompt: string) {
  if (systemPrompt) {
    return systemPrompt
  }
  if (mode === 'translate') {
    return 'system is a language translation engine'
  }
  if (mode === 'polishing') {
    return 'system is a text polishing engine'
  }
  if (mode === 'summarize') {
    return 'system is a text summarization engine'
  }
  if (mode === 'analyze') {
    return 'system is a text analysis engine.'
  }
  return 'system without preset'
}

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { mode, systemPrompt, onBackPress, onMorePress } = props
  const { top } = useSafeAreaInsets()

  const title = getTitle(mode)
  const subtitle = getSubtitle(mode, systemPrompt)

  return (
    <View
      style={[
        styles.container,
        { height: dimensions.barHeight + top, paddingTop: top },
      ]}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <Pressable
        style={styles.touchable}
        hitSlop={{ right: H_EDGE }}
        onPress={onBackPress}>
        <SvgIcon size={dimensions.iconMedium} color="white" name="back" />
      </Pressable>
      <View style={styles.center}>
        <TText style={styles.title} type="title">
          {title}
        </TText>
        <TText
          style={[
            styles.subtitle,
            { textDecorationLine: mode === 'bubble' ? 'line-through' : 'none' },
          ]}
          type="subtitle">
          {subtitle}
        </TText>
      </View>
      <Pressable style={styles.touchable} onPress={onMorePress}>
        <SvgIcon size={dimensions.iconLarge} color="white" name="more" />
      </Pressable>
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
    backgroundColor: 'black',
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

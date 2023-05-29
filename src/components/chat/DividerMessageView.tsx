import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { ChatMessage } from '../../types'
import { ToolButton } from '../ToolButton'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const CONTAINER_SIZE = 36

export type AppDividerView = {
  style?: StyleProp<ViewStyle>
  index: number
  message: ChatMessage
  onSharePress: (message: ChatMessage, index: number) => void
}

export function AppDividerView(props: AppDividerView) {
  const { style, index, message, onSharePress } = props
  const { tint2: text, tint3: strong, backdrop2: weak } = useThemeScheme()

  const shareDisabled = index === 0

  const { t } = useTranslation()
  const isOrigin = message.content === '0'
  const content = isOrigin ? t('START') : t('NEW DIALOGUE')

  const renderLine = (inLeft: boolean) => {
    const _colors = inLeft ? [weak, strong] : [strong, weak]
    return (
      <LinearGradient
        style={styles.line}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={_colors}
      />
    )
  }

  return (
    <View style={[style, styles.container]}>
      <View style={{ width: CONTAINER_SIZE }} />
      <View style={styles.row}>
        {renderLine(true)}
        <Text style={[styles.text, { color: text }]}>{content}</Text>
        {renderLine(false)}
      </View>
      <ToolButton
        style={{ opacity: shareDisabled ? 0 : 1 }}
        containerSize={CONTAINER_SIZE}
        iconSize={12}
        tintTypo="tint2"
        name="share"
        disabled={shareDisabled}
        onPress={() => onSharePress(message, index)}
      />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  row: ViewStyle
  line: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: dimensions.edge,
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
  },
  text: {
    fontSize: 10,
    marginHorizontal: dimensions.edge,
  },
})

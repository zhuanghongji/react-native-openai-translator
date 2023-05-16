import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { ChatMessage } from '../../types'
import { ToolButton } from '../ToolButton'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const CONTAINER_SIZE = 36

export type AppDividerView = {
  style?: StyleProp<ViewStyle>
  message: ChatMessage
  onSavePress: () => void
}

export function AppDividerView(props: AppDividerView) {
  const { style, message, onSavePress } = props

  const { tint2: text, tint3: strong, backdrop2: weak } = useThemeScheme()

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
        <Text style={[styles.text, { color: text }]}>{message.content}</Text>
        {renderLine(false)}
      </View>
      <ToolButton
        containerSize={CONTAINER_SIZE}
        tintTypo="tint2"
        name="chat-share"
        onPress={onSavePress}
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

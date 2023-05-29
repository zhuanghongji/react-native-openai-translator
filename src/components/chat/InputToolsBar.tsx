import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { SvgIcon } from '../SvgIcon'
import { ToolButton } from '../ToolButton'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export interface InputToolsBarProps {
  style?: StyleProp<ViewStyle>
  newDialogueDisabled?: boolean
  inContextNum: number
  contextMessagesNum: number
  onNewDialoguePress: () => void
}

export function InputToolsBar(props: InputToolsBarProps): JSX.Element {
  const {
    style,
    newDialogueDisabled = false,
    inContextNum,
    contextMessagesNum,
    onNewDialoguePress,
  } = props

  const { tint3 } = useThemeScheme()

  return (
    <View style={[styles.container, style]}>
      <ToolButton
        containerSize={36}
        name="chat-new"
        disabled={newDialogueDisabled}
        onPress={onNewDialoguePress}
      />
      <SvgIcon
        style={{ marginLeft: 4, marginBottom: 1 }}
        size={13}
        color={tint3}
        name={'history'}
      />
      <Text style={[styles.num, { color: tint3 }]}>{`${inContextNum}/${contextMessagesNum}`}</Text>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  num: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    paddingHorizontal: dimensions.edge,
    alignItems: 'center',
  },
  num: {
    marginLeft: 2,
    fontSize: 10,
    includeFontPadding: false,
    letterSpacing: 2,
  },
})

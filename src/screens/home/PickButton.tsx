import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { useImageThemeColor, useViewThemeColor } from '../../themes/hooks'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

export interface PickButtonProps {
  style?: StyleProp<ViewStyle>
  text: string
  picking: boolean
  onPress: () => void
}

export function PickButton(props: PickButtonProps) {
  const { style, text, onPress } = props
  const backgroundColor = useViewThemeColor('backdropSecondary')
  const iconColor = useImageThemeColor('tint')
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }, style]}
      onPress={onPress}>
      <TText style={styles.text} type="text">
        {text}
      </TText>
      <SvgIcon
        size={dimensions.iconMedium}
        color={iconColor}
        name="errow-drop-down"
      />
    </TouchableOpacity>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 72,
    height: 32,
    paddingLeft: 8,
    paddingRight: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 11,
  },
})

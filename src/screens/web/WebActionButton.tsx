import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import React from 'react'
import {
  Insets,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type WebActionButtonProps = {
  style?: StyleProp<ViewStyle>
  hitSlop?: Insets
  disabled?: boolean
  iconName: SvgIconName
  text: string
  onBeforePress?: () => void
  onPress?: () => void
}

export function WebActionButton(props: WebActionButtonProps) {
  const { style, hitSlop, disabled = false, iconName, text, onBeforePress, onPress } = props

  const { text3: textColor, tint: iconColor, backdrop2: iconBackgroundColor } = useThemeScheme()

  return (
    <Pressable
      style={[
        styles.container,
        {
          opacity: disabled ? dimensions.disabledOpacity : 1,
        },
        style,
      ]}
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={() => {
        onBeforePress?.()
        onPress?.()
      }}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <SvgIcon size={32} color={iconColor} name={iconName} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  iconContainer: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: dimensions.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
})

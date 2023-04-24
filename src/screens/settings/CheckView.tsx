import { SvgIcon } from '../../components/SvgIcon'
import { hapticSoft } from '../../haptic'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export interface CheckViewProps {
  style?: StyleProp<ViewStyle>
  title: string
  value: boolean
  onValueChange: (value: boolean) => void
}

export function CheckView(props: CheckViewProps) {
  const { style, title, value, onValueChange } = props

  const { tint: iconColor } = useThemeScheme()

  return (
    <View style={[styles.container, style]}>
      <TText style={styles.text} typo="text">
        {title}
      </TText>
      <Pressable
        hitSlop={dimensions.hitSlop}
        onPress={() => {
          hapticSoft()
          onValueChange(!value)
        }}>
        <SvgIcon
          size={dimensions.iconMedium}
          color={iconColor}
          name={value ? 'check-on' : 'check-off'}
        />
      </Pressable>
    </View>
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
    width: '100%',
    height: 32,
    paddingRight: 6.5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    padding: 0,
  },
})

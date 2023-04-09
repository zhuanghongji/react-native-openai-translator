import { PickModalHandle } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import React from 'react'
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent<PressableProps>(Pressable)

export interface PickButtonProps {
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  label: string
  animatedIndex: Animated.SharedValue<number>
  pickModalRef: React.RefObject<PickModalHandle>
}

export function PickButton(props: PickButtonProps) {
  const { style, disabled, label, animatedIndex, pickModalRef } = props

  const iconColor = useThemeColor('tint')
  const borderColor = useThemeColor('border')
  const backgroundColor = useThemeColor('backdrop2')

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        animatedIndex.value,
        [-1, 0],
        [colors.transparent, borderColor as string]
      ),
    }
  })

  const transfromStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${(animatedIndex.value + 1) * 90}deg`,
        },
      ],
    }
  })

  return (
    <AnimatedPressable
      style={[
        styles.container,
        { backgroundColor, opacity: disabled ? dimensions.disabledOpacity : 1 },
        borderStyle,
        style,
      ]}
      disabled={disabled}
      hitSlop={{ top: 2, right: 2 }}
      onPress={() => pickModalRef.current?.show()}>
      <TText style={styles.text} typo="text">
        {label}
      </TText>
      <Animated.View style={transfromStyle}>
        <SvgIcon size={dimensions.iconMedium} color={iconColor} name="errow-drop-down" />
      </Animated.View>
    </AnimatedPressable>
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
    paddingLeft: 6,
    paddingRight: 2,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  text: {
    fontSize: 11,
  },
})

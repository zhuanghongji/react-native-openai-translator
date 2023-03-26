import { PickModalHandle } from '../../components/PickModal'
import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useImageThemeColor, useViewThemeColor } from '../../themes/hooks'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent<TouchableOpacityProps>(TouchableOpacity)

export interface PickButtonProps {
  style?: StyleProp<ViewStyle>
  text: string
  animatedIndex: Animated.SharedValue<number>
  pickModalRef: React.RefObject<PickModalHandle>
}

export function PickButton(props: PickButtonProps) {
  const { style, text, animatedIndex, pickModalRef } = props

  const borderColor = useViewThemeColor('border')
  const backgroundColor = useViewThemeColor('backdropSecondary')
  const iconColor = useImageThemeColor('tint')

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
    <AnimatedTouchableOpacity
      style={[styles.container, { backgroundColor }, borderStyle, style]}
      activeOpacity={1.0}
      hitSlop={{ top: 2, right: 2 }}
      onPress={() => pickModalRef.current?.show()}>
      <TText style={styles.text} type="text">
        {text}
      </TText>
      <Animated.View style={transfromStyle}>
        <SvgIcon
          size={dimensions.iconMedium}
          color={iconColor}
          name="errow-drop-down"
        />
      </Animated.View>
    </AnimatedTouchableOpacity>
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
    borderWidth: 0.5,
  },
  text: {
    fontSize: 11,
  },
})
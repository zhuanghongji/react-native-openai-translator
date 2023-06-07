import { SvgIcon } from '../../components/SvgIcon'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import React, { useEffect, useRef, useState } from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

const HEIGHT = 64
const TEXT_LEFT = 16

export type BottomInputProps = {
  style?: StyleProp<ViewStyle>
  index: number
  value: string
  verified: boolean | undefined
  verifying: boolean
  onChangeText: (value: string) => void
}

export function BottomInput(props: BottomInputProps) {
  const { style, index, value, verified, verifying, onChangeText } = props

  const { width: frameWidth } = useSafeAreaFrame()
  const inputWidth = frameWidth - dimensions.edgeTwice * 2

  const anim = useSharedValue(0)
  const inputAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(anim.value, [0, 1], [4, 0], Extrapolation.CLAMP),
        },
      ],
    }
  })
  const iconAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `-${anim.value * 90}deg`,
        },
      ],
    }
  })

  let color = colors.black
  let borderColor = colors.transparent
  if (verified === true) {
    color = colors.in
    borderColor = colors.in
  } else if (verified === false) {
    color = colors.out
    borderColor = colors.out
  }

  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)
  const inputing = focused || value ? true : false
  useEffect(() => {
    anim.value = withTiming(inputing ? 1 : 0)
  }, [inputing])

  return (
    <View style={[styles.container, { width: inputWidth, borderColor }, style]}>
      <Animated.View style={inputAnimStyle}>
        <TextInput
          ref={inputRef}
          style={styles.text}
          multiline={true}
          numberOfLines={2}
          value={value}
          placeholder={` ${index + 1}th API Key`}
          returnKeyType="done"
          blurOnSubmit={true}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Animated.View>
      <Pressable
        style={[StyleSheet.absoluteFill, styles.rowCenter]}
        pointerEvents={focused ? 'none' : 'auto'}
        hitSlop={dimensions.hitSlop}
        onPress={() => {
          if (verifying) {
            return
          }
          inputRef.current?.focus()
        }}>
        <Animated.View style={iconAnimStyle}>
          <SvgIcon size={dimensions.iconMedium} color={color} name="vpn-key" />
        </Animated.View>
      </Pressable>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
  rowCenter: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
    alignItems: 'center',
    marginBottom: dimensions.edge,
    paddingHorizontal: dimensions.edge,
    borderWidth: 1,
    borderRadius: dimensions.borderRadius,
    backgroundColor: colors.white,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    marginLeft: TEXT_LEFT,
  },
  rowCenter: {
    flexDirection: 'row',
    height: HEIGHT,
    alignItems: 'center',
    paddingLeft: 8,
    // backgroundColor: 'green',
  },
})

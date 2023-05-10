import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeScheme } from '../themes/hooks'
import { SvgIcon } from './SvgIcon'
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

export type FilterInputProps = {
  style?: StyleProp<ViewStyle>
  value: string
  onChangeText: (value: string) => void
}

export function FilterInput(props: FilterInputProps) {
  const { style, value, onChangeText } = props

  const { dark, tint, tint3 } = useThemeScheme()
  const backgroundColor = dark ? colors.black : colors.white

  const { width: frameWidth } = useSafeAreaFrame()
  const width = frameWidth - dimensions.edgeTwice

  const anim = useSharedValue(0)
  const wrapperAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value === 1 ? 1 : 0,
    }
  })
  const tipX = useSharedValue(0)
  const tipAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            anim.value,
            [0, 1],
            [0, -tipX.value + dimensions.edge],
            Extrapolation.CLAMP
          ),
        },
      ],
    }
  })
  const tipTextAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(anim.value, [0, 1], [1, 0], Extrapolation.CLAMP),
    }
  })

  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)

  const filtering = focused || value ? true : false
  useEffect(() => {
    anim.value = withTiming(filtering ? 1 : 0)
  }, [filtering])

  return (
    <View
      style={[styles.container, { width, marginLeft: dimensions.edge, backgroundColor }, style]}>
      <Animated.View style={[styles.wrapper, wrapperAnimStyle]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          numberOfLines={1}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value ? (
          <Pressable hitSlop={dimensions.hitSlop} onPress={() => onChangeText('')}>
            <SvgIcon size={dimensions.iconSmall} color={tint} name="close" />
          </Pressable>
        ) : null}
      </Animated.View>

      <Pressable
        style={[StyleSheet.absoluteFill, styles.rowCenter]}
        pointerEvents={focused ? 'none' : 'auto'}
        hitSlop={dimensions.hitSlop}
        onPress={() => {
          inputRef.current?.focus()
        }}>
        <Animated.View
          style={[styles.rowCenter, tipAnimStyle]}
          onLayout={e => (tipX.value = e.nativeEvent.layout.x)}>
          <SvgIcon size={dimensions.iconSmall} color={tint3} name="filter-list" />
          <Animated.Text style={[styles.text, { color: tint3 }, tipTextAnimStyle]}>
            Filter
          </Animated.Text>
        </Animated.View>
      </Pressable>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  wrapper: ViewStyle
  rowCenter: ViewStyle
  input: TextStyle
  text: TextStyle
}

const TEXT_LEFT = 6

const styles = StyleSheet.create<Styles>({
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
    paddingHorizontal: dimensions.edge,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    marginLeft: dimensions.iconSmall + TEXT_LEFT,
  },
  text: {
    fontSize: 14,
    padding: 0,
    marginLeft: TEXT_LEFT,
  },
})

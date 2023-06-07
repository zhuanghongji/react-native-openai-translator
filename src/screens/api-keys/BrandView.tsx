import { BrandText } from './BrandText'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { SharedValue, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'

type Item = {
  text: string
  color: string
  backgroundColor: string
}

export type BrandViewProps = {
  style?: StyleProp<ViewStyle>
  anim: SharedValue<number>
  items: Item[]
}

export function BrandView(props: BrandViewProps) {
  const { anim, items } = props

  const { top } = useSafeAreaInsets()
  const { width: frameWidth } = useSafeAreaFrame()

  const containerAnimStyle = useAnimatedStyle(() => {
    const inputRange: number[] = []
    const outputRange: string[] = []
    items.forEach((item, index) => {
      inputRange.push(index)
      inputRange.push(index + 0.5)
      outputRange.push(item.backgroundColor)
      outputRange.push(item.backgroundColor)
    })
    return {
      backgroundColor: interpolateColor(anim.value, inputRange, outputRange),
    }
  }, [anim, items])

  return (
    <Animated.View style={[styles.content, containerAnimStyle]}>
      <View style={[styles.wrapper, { marginTop: frameWidth / 2 + top }]}>
        {items.map((item, index) => {
          const { text, color } = item
          const nextColor = items[(index + 1) % items.length]?.color ?? color
          return (
            <BrandText
              key={`${index}_${item}`}
              anim={anim}
              index={index}
              value={text}
              color={color}
              nextColor={nextColor}
            />
          )
        })}
      </View>
    </Animated.View>
  )
}

type Styles = {
  content: ViewStyle
  wrapper: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    alignItems: 'center',
  },
})

import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native'
import Animated, { useAnimatedProps } from 'react-native-reanimated'

Animated.addWhitelistedNativeProps({ text: true })
const AnimatedTextInput =
  Animated.createAnimatedComponent<TextInputProps>(TextInput)

export type RTextProps = {
  style: StyleProp<TextStyle>
  value: Animated.SharedValue<string>
}

/**
 * Reanimated Text
 */
export function RText(props: RTextProps) {
  const { style, value } = props

  const animatedProps = useAnimatedProps<any>(() => {
    return {
      text: value.value,
    }
  })

  return (
    <AnimatedTextInput
      style={[styles.text, style]}
      multiline={true}
      underlineColorAndroid="transparent"
      editable={false}
      value={value.value}
      animatedProps={animatedProps}
    />
  )
}

type Styles = {
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
})

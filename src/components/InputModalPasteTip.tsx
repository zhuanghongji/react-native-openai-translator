import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useTextThemeStyle } from '../themes/hooks'
import { SvgIcon } from './SvgIcon'
import Clipboard from '@react-native-clipboard/clipboard'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export interface InputModalPasteTipProps {
  style?: StyleProp<ViewStyle>
  onPastePress: (value: string) => void
}

const MARGIN_V = 18
const HEIGHT = 84

export const InputModalPasteTip = React.memo((props: InputModalPasteTipProps) => {
  const { style, onPastePress } = props

  const textStyle = useTextThemeStyle('text')

  const [text, setText] = useState('')
  const [pressable, setPressed] = useState(false)

  const anim = useSharedValue(0)
  const animStyle = useAnimatedStyle(() => ({
    height: interpolate(anim.value, [0, 1], [0, HEIGHT], Extrapolation.CLAMP),
    marginTop: interpolate(anim.value, [0, 1], [0, MARGIN_V], Extrapolation.CLAMP),
    marginBottom: interpolate(anim.value, [0, 1], [0, MARGIN_V * 2], Extrapolation.CLAMP),
  }))

  useEffect(() => {
    Clipboard.getString().then(value => {
      setText(value.trim())
      anim.value = withTiming(1)
    })
  }, [])

  if (!text || pressable) {
    return null
  }
  return (
    <Animated.View style={[styles.container, style, animStyle]}>
      <View style={{ flex: 1, paddingLeft: 24, alignItems: 'center' }}>
        <Text style={[textStyle, { fontWeight: 'bold', marginVertical: 8 }]}>
          Clipboard Detected
        </Text>
        <Text style={[styles.text, textStyle]} numberOfLines={2}>
          {text}
        </Text>
      </View>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          onPastePress(text)
          anim.value = withTiming(0, { easing: Easing.inOut(Easing.ease) }, () => {
            runOnJS(setPressed)(true)
          })
        }}>
        <SvgIcon size={dimensions.iconMedium} color={colors.accent} name="input-circle" />
      </Pressable>
    </Animated.View>
  )
})

type Styles = {
  container: ViewStyle
  text: TextStyle
  pressable: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
    textAlignVertical: 'center',
    padding: 0,
  },
  pressable: {
    width: HEIGHT,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

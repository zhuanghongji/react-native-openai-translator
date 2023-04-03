import { SvgIcon } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { useViewThemeColor } from '../../themes/hooks'
import React from 'react'
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface InputBarProps {
  value: string
  onChangeText: (value: string) => void
  onSendPress: () => void
}

const H_EDGE = 8

export function InputBar(props: InputBarProps): JSX.Element {
  const { value, onChangeText, onSendPress } = props
  const backdropSecondaryColor = useViewThemeColor('backdropSecondary')

  const { bottom } = useSafeAreaInsets()
  const { height, progress } = useReanimatedKeyboardAnimation()
  const heightStyle = useAnimatedStyle(
    () => ({
      paddingBottom: (1 - progress.value) * bottom,
      transform: [{ translateY: height.value }],
    }),
    []
  )

  return (
    <Animated.View style={[styles.container, heightStyle]}>
      <View style={styles.content}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: '#282828',
            },
          ]}
          value={value}
          placeholder="Send a message..."
          onChangeText={onChangeText}
        />
        <Pressable
          style={styles.touchable}
          hitSlop={{
            left: H_EDGE,
            top: H_EDGE,
            right: H_EDGE,
            bottom: H_EDGE,
          }}
          onPress={onSendPress}>
          <SvgIcon size={dimensions.iconLarge} color="white" name="send" />
        </Pressable>
      </View>
    </Animated.View>
  )
}

type Styles = {
  container: ViewStyle
  content: ViewStyle
  input: ViewStyle
  touchable: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    backgroundColor: '#1C1C1C',
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    paddingHorizontal: H_EDGE,
  },
  input: {
    flex: 1,
    minHeight: 32,
    color: 'white',
    paddingHorizontal: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    marginLeft: dimensions.edge,
    marginRight: dimensions.edge + H_EDGE,
  },
  touchable: {
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

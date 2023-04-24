import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeDark, useThemeScheme } from '../../themes/hooks'
import { SvgIcon } from '../SvgIcon'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface InputBarProps {
  value: string
  sendDisabled: boolean
  onChangeText: (value: string) => void
  onSendPress: () => void
}

const H_EDGE = 8

export function InputBar(props: InputBarProps): JSX.Element {
  const { value, sendDisabled, onChangeText, onSendPress } = props

  const isDark = useThemeDark()
  const tintColor = isDark ? colors.white : colors.black
  const textColor = isDark ? colors.white : colors.black
  const backgroundColor = isDark ? colors.c1C : colors.cF7
  const backgroundColor2 = isDark ? colors.c28 : colors.white

  const { placeholder: placeholderColor } = useThemeScheme()

  const { bottom } = useSafeAreaInsets()
  const { height, progress } = useReanimatedKeyboardAnimation()
  const heightStyle = useAnimatedStyle(
    () => ({
      paddingBottom: (1 - progress.value) * bottom,
      transform: [{ translateY: height.value }],
    }),
    []
  )

  const { t } = useTranslation()
  const opacity = sendDisabled ? dimensions.disabledOpacity : 1

  return (
    <Animated.View style={[styles.container, heightStyle, { backgroundColor }]}>
      <View style={styles.content}>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              backgroundColor: backgroundColor2,
            },
          ]}
          placeholderTextColor={placeholderColor}
          value={value}
          placeholder={t('Send a message...')}
          onChangeText={onChangeText}
        />
        <Pressable
          style={[styles.touchable, { opacity }]}
          disabled={sendDisabled}
          hitSlop={{
            left: H_EDGE,
            top: H_EDGE,
            right: H_EDGE,
            bottom: H_EDGE,
          }}
          onPress={onSendPress}>
          <SvgIcon size={dimensions.iconLarge} color={tintColor} name="send" />
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
    minHeight: 36,
    paddingHorizontal: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    marginLeft: dimensions.edge,
    marginRight: dimensions.edge + H_EDGE,
    padding: 0,
  },
  touchable: {
    width: 36,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme, useThemeSelector } from '../../themes/hooks'
import { SvgIcon } from '../SvgIcon'
import { ToolButton } from '../ToolButton'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface InputBarProps {
  value: string
  sendDisabled: boolean
  inContextNum: number
  contextMessagesNum: number
  onChangeText: (value: string) => void
  onSendPress: () => void
  onNewDialoguePress: () => void
}

const H_EDGE = 8

export function InputBar(props: InputBarProps): JSX.Element {
  const {
    value,
    sendDisabled,
    inContextNum,
    contextMessagesNum,
    onChangeText,
    onSendPress,
    onNewDialoguePress,
  } = props

  const tintColor = useThemeSelector(colors.white, colors.black)
  const textColor = useThemeSelector(colors.white, colors.black)
  const backgroundColor = useThemeSelector(colors.c1C, colors.cF7)
  const backgroundColor2 = useThemeSelector(colors.c28, colors.white)

  const { placeholder: placeholderColor, tint3 } = useThemeScheme()

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

  const sendAnim = useSharedValue(0)
  const sendAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sendAnim.value, [0, 1], [0.3, 1], Extrapolation.CLAMP),
      transform: [
        // { translateX: interpolate(sendAnim.value, [0, 1], [0, -5], Extrapolation.CLAMP) },
        // { translateY: interpolate(sendAnim.value, [0, 1], [0, -5], Extrapolation.CLAMP) },
        // { rotate: `-${sendAnim.value * 45}deg` },
        // { rotate: `-${sendAnim.value * 90}deg` },
        { rotate: `-${sendAnim.value * 90}deg` },
      ],
    }
  })
  useEffect(() => {
    sendAnim.value = withTiming(sendDisabled ? 0 : 1, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    })
  }, [sendDisabled])

  return (
    <Animated.View style={[styles.container, heightStyle, { backgroundColor }]}>
      <View style={styles.toolsRow}>
        <ToolButton containerSize={36} name="chat-new" onPress={onNewDialoguePress} />
        <SvgIcon
          style={{ marginLeft: 4, marginBottom: 1 }}
          size={15}
          color={tint3}
          name={'history'}
        />
        <Text
          style={[
            styles.messagesNum,
            { color: tint3 },
          ]}>{`${inContextNum}/${contextMessagesNum}`}</Text>
      </View>
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
          multiline={true}
          placeholder={t('Send a message...')}
          onSubmitEditing={() => onChangeText(`${value}\n`)}
          onChangeText={onChangeText}
        />
        <Animated.View style={sendAnimStyle}>
          <Pressable
            style={[styles.touchable]}
            disabled={sendDisabled}
            hitSlop={{
              left: H_EDGE,
              top: H_EDGE,
              right: dimensions.edge,
              bottom: H_EDGE,
            }}
            onPress={onSendPress}>
            <SvgIcon size={dimensions.iconLarge} color={tintColor} name="send" />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  )
}

type Styles = {
  container: ViewStyle
  toolsRow: ViewStyle
  messagesNum: TextStyle
  content: ViewStyle
  input: ViewStyle
  touchable: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
  },
  toolsRow: {
    flexDirection: 'row',
    paddingHorizontal: dimensions.edge,
    alignItems: 'center',
  },
  messagesNum: {
    marginLeft: 2,
    fontSize: 12,
    includeFontPadding: false,
    letterSpacing: 2,
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: H_EDGE,
    marginBottom: dimensions.edge,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    paddingVertical: 6,
    paddingHorizontal: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    marginLeft: dimensions.edge,
    marginRight: dimensions.edge,
  },
  touchable: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

import { print } from '../printer'
import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useTextThemeStyle, useThemeColor } from '../themes/hooks'
import { InputModalPasteTip } from './InputModalPasteTip'
import { SvgIcon } from './SvgIcon'
import { TText } from './TText'
import React, { useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Modal from 'react-native-modal'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

type Selection = { start: number; end: number } | undefined

export interface InputModalProps {
  style?: StyleProp<ViewStyle>
  visible: boolean
  title: string
  initialValue: string
  securable?: boolean
  leftText: string
  rightText: string
  onLeftPress?: () => void
  onRightPress?: (newValue: string) => void
  onDismissRequest: (visible: false) => void
}

export const InputModal = React.memo((props: InputModalProps) => {
  const {
    style,
    visible,
    title,
    initialValue,
    securable = false,
    leftText,
    rightText,
    onLeftPress,
    onRightPress,
    onDismissRequest,
  } = props

  const { width: frameWidth, height: frameHeight } = useSafeAreaFrame()

  const textStyle = useTextThemeStyle('text')
  const iconColor = useThemeColor('tint')
  const borderColor = useThemeColor('border2')
  const backdropColor = useThemeColor('backdrop')
  const backgroundColor = useThemeColor('backdrop2')

  const [currentValue, setCurrentValue] = useState(initialValue)
  const [preInitialValue, setPreInitialValue] = useState(initialValue)
  if (initialValue !== preInitialValue) {
    setPreInitialValue(initialValue)
    setCurrentValue(initialValue)
  }

  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [focused, setFocused] = useState(false)
  const clearable = focused && currentValue.length > 0

  const inputRef = useRef<TextInput>(null)
  const [selection, setSelection] = useState<Selection>(undefined)
  useEffect(() => {
    if (!visible) {
      return
    }
    const timer = setTimeout(() => {
      inputRef.current?.focus()
      setSelection({ start: initialValue.length, end: initialValue.length })
    }, 300)
    return () => clearTimeout(timer)
  }, [initialValue, visible])

  const keyboardY = useSharedValue(0)
  const keyboardTransformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: keyboardY.value,
        },
      ],
    }
  })
  useEffect(() => {
    const subscription1 = Keyboard.addListener('keyboardDidShow', () => {
      keyboardY.value = withTiming(-48)
    })
    const subscription2 = Keyboard.addListener('keyboardDidHide', () => {
      keyboardY.value = withTiming(0)
    })
    return () => {
      subscription1.remove()
      subscription2.remove()
    }
  }, [])

  const dissmiss = () => onDismissRequest(false)

  const renderButton = (txtStyle: TextStyle | undefined, txt: string, onPress?: () => void) => {
    return (
      <Pressable
        style={styles.buttonContainer}
        onPress={() => {
          dissmiss()
          onPress?.()
        }}>
        <TText style={[styles.buttonText, txtStyle]} typo="text">
          {txt}
        </TText>
      </Pressable>
    )
  }

  return (
    <Modal
      style={[styles.container, style]}
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationOutTiming={1}
      deviceHeight={frameHeight}
      statusBarTranslucent={true}
      onBackButtonPress={() => onDismissRequest(false)}
      onBackdropPress={dissmiss}>
      <Animated.View style={[styles.content, keyboardTransformStyle]}>
        <Animated.View
          style={[
            styles.dialog,
            {
              width: frameWidth * 0.8,
              backgroundColor: backdropColor,
            },
          ]}>
          <TText style={styles.title} typo="text">
            {title}
          </TText>
          <View style={[styles.input, { backgroundColor }]}>
            <TextInput
              ref={inputRef}
              style={[styles.text, textStyle]}
              secureTextEntry={securable && secureTextEntry}
              value={currentValue}
              multiline={!securable || !secureTextEntry}
              selection={selection}
              onSelectionChange={e => {
                print('onSelectionChange', e.nativeEvent)
                setSelection(undefined)
                // setSelection(e.nativeEvent.selection)
              }}
              onChangeText={text => setCurrentValue(text.trim())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <Pressable
              style={[styles.clear, { opacity: clearable ? 1 : 0 }]}
              disabled={!clearable}
              hitSlop={{
                left: dimensions.edge,
                top: dimensions.edge,
                right: 9,
                bottom: dimensions.edge,
              }}
              onPress={() => setCurrentValue('')}>
              <SvgIcon size={dimensions.iconSmall} color={iconColor} name="close" />
            </Pressable>
            {securable ? (
              <Pressable
                style={styles.secure}
                hitSlop={{
                  left: 4,
                  top: dimensions.edge,
                  right: dimensions.edge,
                  bottom: dimensions.edge,
                }}
                onPress={() => setSecureTextEntry(!secureTextEntry)}>
                <SvgIcon
                  size={dimensions.iconSmall}
                  color={iconColor}
                  name={secureTextEntry ? 'visibility' : 'visibility-off'}
                />
              </Pressable>
            ) : null}
          </View>
          <View style={[styles.buttonRow, { borderTopColor: borderColor }]}>
            {renderButton(undefined, leftText, () => {
              onLeftPress?.()
              setTimeout(() => setCurrentValue(initialValue), 300)
            })}
            <View style={[styles.buttonDivider, { backgroundColor: borderColor }]} />
            {renderButton({ color: colors.accent }, rightText, () => {
              onRightPress?.(currentValue.trim())
            })}
          </View>
        </Animated.View>
        <InputModalPasteTip
          style={{ width: frameWidth * 0.9, backgroundColor: backdropColor }}
          onPastePress={value => {
            setCurrentValue(value)
            setSelection({ start: value.length, end: value.length })
          }}
        />
      </Animated.View>
    </Modal>
  )
})

type Styles = {
  container: ViewStyle
  content: ViewStyle
  dialog: ViewStyle
  title: TextStyle
  input: ViewStyle
  text: TextStyle
  clear: ViewStyle
  secure: ViewStyle
  buttonRow: ViewStyle
  buttonContainer: ViewStyle
  buttonDivider: ViewStyle
  buttonText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  content: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  dialog: {
    borderRadius: dimensions.borderRadius,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    marginVertical: dimensions.edgeTwice,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    minHeight: 42,
    paddingLeft: dimensions.edge,
    marginBottom: dimensions.edgeTwice,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  clear: {
    marginLeft: 11,
    marginRight: 9,
  },
  secure: {
    marginLeft: 4,
    marginRight: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
  },
  buttonDivider: {
    width: 1,
    height: 48,
  },
  buttonContainer: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})

import { SvgIcon } from '../../../components/SvgIcon'
import { hapticSoft } from '../../../haptic'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { sheets } from '../../../res/sheets'
import { useThemeScheme, useThemeTextStyle } from '../../../themes/hooks'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

type Selection = TextInputProps['selection']

export interface InputViewProps extends Pick<ViewProps, 'onLayout'> {
  value: string
  onChangeText: (value: string) => void
  onSubmitEditing: (text: string) => void
}

export interface InputViewHandle {
  focus: () => void
  blur: () => void
}

export const InputView = React.forwardRef<InputViewHandle, InputViewProps>((props, ref) => {
  const { value, onChangeText, onSubmitEditing } = props

  const textInputRef = useRef<TextInput>(null)

  const focusedRef = useRef(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!focused) {
      return
    }
    const subscrition = Keyboard.addListener('keyboardDidHide', () => {
      if (focusedRef.current === false) {
        return
      }
      textInputRef.current?.blur()
    })
    return () => subscrition.remove()
  }, [focused])

  const { tint: tintColor, border: borderColor, backdrop: backdropColor } = useThemeScheme()
  const textStyle = useThemeTextStyle('text')

  const textLengthRef = useRef(value.length)
  useEffect(() => {
    textLengthRef.current = value.length
  }, [value])

  const [textInputSelection, setTextInputSelection] = useState<Selection>(undefined)
  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus()
      const length = textLengthRef.current
      setTextInputSelection({ start: length })
    },
    blur: () => textInputRef.current?.blur(),
  }))

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: focused ? borderColor : colors.transparent,
          backgroundColor: backdropColor,
        },
      ]}>
      <TextInput
        ref={textInputRef}
        multiline
        blurOnSubmit
        scrollEnabled
        style={[sheets.contentText, styles.text, textStyle]}
        value={value}
        returnKeyType="send"
        selection={textInputSelection}
        onSelectionChange={e => {
          // print('onSelectionChange', e.nativeEvent.selection)
          setTextInputSelection(e.nativeEvent.selection)
        }}
        onChangeText={onChangeText}
        onFocus={() => {
          focusedRef.current = true
          setFocused(true)
        }}
        onBlur={() => {
          focusedRef.current = false
          setFocused(false)
        }}
        onSubmitEditing={e => {
          const { text } = e.nativeEvent
          if (!text) {
            return
          }
          onSubmitEditing(text)
        }}
      />
      {focused ? (
        <Pressable
          style={styles.touchable}
          hitSlop={dimensions.hitSlop}
          onPress={() => {
            hapticSoft()
            if (!textInputSelection) {
              onChangeText(value + '\n')
              return
            }
            const { start, end } = textInputSelection
            const left = value.substring(0, start)
            const right = value.substring(end === undefined ? start : end)
            onChangeText(`${left}\n${right}`)
            setTextInputSelection({ start: start + 1 })
          }}>
          <SvgIcon size={dimensions.iconSmall} color={tintColor} name="keyborad-return" />
        </Pressable>
      ) : (
        <View style={styles.cornerMark}>
          <View style={[styles.cornerMarkLong, { backgroundColor: tintColor }]} />
          <View style={[styles.cornerMarkShort, { backgroundColor: tintColor }]} />
        </View>
      )}
    </View>
  )
})

type Styles = {
  container: ViewStyle
  text: TextStyle
  touchable: ViewStyle
  cornerMark: ViewStyle
  cornerMarkLong: ViewStyle
  cornerMarkShort: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    height: 240,
    padding: dimensions.edge,
    marginTop: dimensions.edge,
    marginHorizontal: dimensions.edge,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    textAlignVertical: 'top',
    textAlign: 'justify',
    marginBottom: 20,
  },
  touchable: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  cornerMark: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    paddingTop: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
  cornerMarkLong: {
    width: 12,
    height: 1,
  },
  cornerMarkShort: {
    width: 4,
    height: 1,
  },
})

import { SvgIcon } from '../../components/SvgIcon'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import {
  useImageThemeColor,
  useTextThemeStyle,
  useViewThemeColor,
} from '../../themes/hooks'
import React, { useImperativeHandle, useRef, useState } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export interface InputViewProps {
  value: string
  onChangeText: (value: string) => void
  onSubmitEditing: (text: string) => void
}

export interface InputViewHandle {
  focus: () => void
  blur: () => void
}

export const InputView = React.forwardRef<InputViewHandle, InputViewProps>(
  (props, ref) => {
    const { value, onChangeText, onSubmitEditing } = props
    const [foucus, setFocus] = useState(false)

    const textStyle = useTextThemeStyle('text')
    const tintColor = useImageThemeColor('tint')

    const borderColor = useViewThemeColor('border')
    const backdropColor = useViewThemeColor('backdrop')

    const textInputRef = useRef<TextInput>(null)
    useImperativeHandle(
      ref,
      () => ({
        focus: () => textInputRef.current?.focus(),
        blur: () => textInputRef.current?.blur(),
      }),
      []
    )

    return (
      <View
        style={[
          styles.container,
          {
            borderColor: foucus ? borderColor : colors.transparent,
            backgroundColor: backdropColor,
          },
        ]}>
        <TextInput
          ref={textInputRef}
          multiline
          blurOnSubmit
          scrollEnabled
          style={[styles.text, textStyle]}
          value={value}
          returnKeyType="send"
          onChangeText={onChangeText}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onSubmitEditing={e => {
            const { text } = e.nativeEvent
            if (!text) {
              return
            }
            onSubmitEditing(text)
          }}
        />
        {foucus ? (
          <Pressable
            style={styles.touchable}
            hitSlop={dimensions.hitSlop}
            onPress={() => {
              onChangeText(value + '\n')
            }}>
            <SvgIcon
              size={dimensions.iconSmall}
              color={tintColor}
              name="keyborad-return"
            />
          </Pressable>
        ) : (
          <View style={styles.cornerMark}>
            <View
              style={[styles.cornerMarkLong, { backgroundColor: tintColor }]}
            />
            <View
              style={[styles.cornerMarkShort, { backgroundColor: tintColor }]}
            />
          </View>
        )}
      </View>
    )
  }
)

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
    textAlign: 'justify',
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
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

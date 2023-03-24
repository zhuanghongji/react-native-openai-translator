import { SvgIcon } from '../../components/SvgIcon'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import {
  useImageThemeColor,
  useTextThemeStyle,
  useViewThemeColor,
} from '../../themes/hooks'
import React, { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

export interface InputViewProps {
  value: string
  onChangeText: (value: string) => void
}

export function InputView(props: InputViewProps): JSX.Element {
  const { value, onChangeText } = props
  const [foucus, setFocus] = useState(false)

  const textStyle = useTextThemeStyle('text')
  const tintColor = useImageThemeColor('tint')

  const borderColor = useViewThemeColor('border')
  const backdropColor = useViewThemeColor('backdrop')

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
          console.log(e.nativeEvent.text)
        }}
      />
      {foucus ? (
        <TouchableOpacity
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
        </TouchableOpacity>
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

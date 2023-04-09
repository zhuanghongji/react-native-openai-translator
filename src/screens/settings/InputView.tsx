import { SvgIcon } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { useTextThemeStyle, useThemeColor } from '../../themes/hooks'
import React, { useState } from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

export interface InputViewProps {
  style?: StyleProp<ViewStyle>
  securable?: boolean
  value: string
  onChangeText: (value: string) => void
}

export function InputView(props: InputViewProps) {
  const { style, securable, value, onChangeText } = props
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const textStyle = useTextThemeStyle('text')
  const iconColor = useThemeColor('tint')
  const backgroundColor = useThemeColor('backdrop2')

  const [foucsd, setFocused] = useState(false)

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <TextInput
        style={[styles.text, textStyle]}
        secureTextEntry={securable && secureTextEntry}
        value={value}
        onChangeText={text => onChangeText(text.trim())}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <Pressable
        style={[styles.clear, { opacity: foucsd ? 1 : 0 }]}
        disabled={!foucsd}
        hitSlop={{
          left: dimensions.edge,
          top: dimensions.edge,
          right: 9,
          bottom: dimensions.edge,
        }}
        onPress={() => setSecureTextEntry(!secureTextEntry)}>
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
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
  clear: ViewStyle
  secure: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 42,
    paddingLeft: dimensions.edge,
    marginTop: 6,
    borderRadius: 4,
  },
  text: {
    flex: 1,
    fontSize: 14,
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
})

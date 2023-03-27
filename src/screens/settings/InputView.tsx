import { SvgIcon } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import {
  useImageThemeColor,
  useTextThemeStyle,
  useViewThemeColor,
} from '../../themes/hooks'
import React, { useState } from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
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
  const iconColor = useImageThemeColor('tint')
  const backgroundColor = useViewThemeColor('backdropSecondary')

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <TextInput
        secureTextEntry={securable && secureTextEntry}
        style={[styles.text, textStyle]}
        value={value}
        onChangeText={onChangeText}
      />
      {securable ? (
        <Pressable
          style={styles.touchable}
          hitSlop={dimensions.hitSlop}
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
  touchable: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 32,
    marginTop: 6,
    borderRadius: 4,
  },
  text: {
    flex: 1,
    fontSize: 11,
    height: 32,
    paddingLeft: 8,
    // backgroundColor: 'red',
  },
  touchable: {
    marginLeft: 7.5,
    marginRight: 7.5,
  },
})

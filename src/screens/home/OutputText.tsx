import { dimensions } from '../../res/dimensions'
import { useTextThemeColor } from '../../themes/hooks'
import React, { useImperativeHandle, useState } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

export interface OutputTextProps {
  style?: StyleProp<TextStyle>
}

export interface OutputTextHandle {
  setValue: (value: string) => void
  getValue: () => string
}

export const OutputText = React.forwardRef<OutputTextHandle, OutputTextProps>(
  (props, ref) => {
    const { style } = props
    const textColor = useTextThemeColor('text')
    const [value, setValue] = useState('')

    useImperativeHandle(ref, () => ({
      setValue,
      getValue: () => value,
    }))

    return (
      <Text selectable style={[styles.text, { color: textColor }, style]}>
        {value}
      </Text>
    )
  }
)

type Styles = {
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
    marginHorizontal: dimensions.edge * 2,
  },
})

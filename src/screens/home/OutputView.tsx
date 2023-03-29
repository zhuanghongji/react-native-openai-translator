import { dimensions } from '../../res/dimensions'
import { useTextThemeColor } from '../../themes/hooks'
import React, { useImperativeHandle, useState } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

export interface OutputViewProps {
  style?: StyleProp<TextStyle>
}

export interface OutputViewHandle {
  setContent: (value: string) => void
  getContent: () => string
}

export const OutputView = React.forwardRef<OutputViewHandle, OutputViewProps>(
  (props, ref) => {
    const { style } = props
    const textColor = useTextThemeColor('text')
    const [content, setContent] = useState('')

    useImperativeHandle(ref, () => ({
      setContent,
      getContent: () => content,
    }))

    return (
      <Text selectable style={[styles.text, { color: textColor }, style]}>
        {content}
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
    lineHeight: 22,
    textAlign: 'justify',
    marginHorizontal: dimensions.edge * 2,
  },
})

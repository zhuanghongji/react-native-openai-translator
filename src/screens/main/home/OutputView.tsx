import { dimensions } from '../../../res/dimensions'
import { sheets } from '../../../res/sheets'
import { useThemeScheme } from '../../../themes/hooks'
import React, { useImperativeHandle, useState } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

export interface OutputViewProps {
  style?: StyleProp<TextStyle>
  text: string
}

export interface OutputViewHandle {
  updateText: (text: string) => void
}

export const OutputView = React.forwardRef<OutputViewHandle, OutputViewProps>((props, ref) => {
  const { style, text } = props
  const { text: textColor } = useThemeScheme()

  const [displayText, setDisplayText] = useState('')
  const [preText, setPreText] = useState(text)
  if (text !== preText) {
    setPreText(text)
    setDisplayText(text)
  }

  useImperativeHandle(ref, () => ({
    updateText: setDisplayText,
  }))

  return (
    <Text selectable style={[sheets.contentText, styles.text, { color: textColor }, style]}>
      {displayText}
    </Text>
  )
})

type Styles = {
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    textAlign: 'justify',
    marginHorizontal: dimensions.edgeTwice,
  },
})

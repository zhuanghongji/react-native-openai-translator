import { dimensions } from '../../../res/dimensions'
import { stylez } from '../../../res/stylez'
import { texts } from '../../../res/texts'
import { useThemeScheme } from '../../../themes/hooks'
import { TranslatorStatus } from '../../../types'
import React, { useImperativeHandle, useState } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

export interface OutputViewProps {
  style?: StyleProp<TextStyle>
  status: TranslatorStatus
  assistantText: string | null
  outputText: string
}

export interface OutputViewHandle {
  updateText: (text: string) => void
}

export const OutputView = React.forwardRef<OutputViewHandle, OutputViewProps>((props, ref) => {
  const { style, status, assistantText, outputText } = props
  const { text: textColor, text3: text3Color } = useThemeScheme()
  const color = outputText !== assistantText ? text3Color : textColor

  const [displayText, setDisplayText] = useState('')
  const [preOutputText, setPreOutputText] = useState(outputText)
  if (outputText !== preOutputText) {
    setPreOutputText(outputText)
    setDisplayText(outputText)
  }

  useImperativeHandle(ref, () => ({
    updateText: setDisplayText,
  }))

  return (
    <Text selectable style={[stylez.contentText, styles.text, { color }, style]}>
      {`${displayText}${status === 'pending' ? texts.assistantCursor : ''}`}
    </Text>
  )
})

type Styles = {
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    width: '100%',
    textAlign: 'justify',
    paddingHorizontal: dimensions.edgeTwice,
    padding: 0,
  },
})

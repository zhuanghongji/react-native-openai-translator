import React from 'react'
import { Pressable, Text } from 'react-native'
import { OCRFrame } from 'vision-camera-ocr'

type TextBlock = OCRFrame['result']['blocks'][number]

export interface TextBlockViewProps {
  pixelRatio: number
  block: TextBlock
}

export function TextBlockView(props: TextBlockViewProps): JSX.Element {
  const { pixelRatio, block } = props
  return (
    <Pressable
      style={{
        position: 'absolute',
        left: block.frame.x * pixelRatio,
        top: block.frame.y * pixelRatio,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        borderRadius: 6,
      }}
      onPress={() => {
        // Clipboard.setString(block.text)
        // Alert.alert(`"${block.text}" copied to the clipboard`)
      }}>
      <Text
        style={{
          fontSize: 25,
          justifyContent: 'center',
          textAlign: 'center',
        }}>
        {block.text}
      </Text>
    </Pressable>
  )
}

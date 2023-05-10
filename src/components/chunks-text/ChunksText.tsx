import { colors } from '../../res/colors'
import { TextChunks } from './utils'
import React from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'

export type ChunksTextProps = {
  style?: StyleProp<TextStyle>
  tintColor?: string
  numberOfLines?: number
  chunks: TextChunks
}

export function ChunksText(props: ChunksTextProps) {
  const { style, tintColor = colors.primary, numberOfLines, chunks } = props
  if (!chunks.splitted) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {chunks.raw}
      </Text>
    )
  }
  const { start, left, center, right, end } = chunks
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      <Text>{start ? `...${left}` : left}</Text>
      <Text style={{ color: tintColor }}>{center}</Text>
      <Text>{end ? `${right}...` : right}</Text>
    </Text>
  )
}

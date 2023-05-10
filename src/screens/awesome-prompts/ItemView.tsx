import { SvgIcon } from '../../components/SvgIcon'
import { ChunksText } from '../../components/chunks-text/ChunksText'
import { TextChunks } from '../../components/chunks-text/utils'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeDark, useThemeScheme } from '../../themes/hooks'
import { Seperator } from './Seperator'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type ItemViewProps = {
  style?: StyleProp<ViewStyle>
  titleChunks: TextChunks
  contentChunks: TextChunks
}

export function ItemView(props: ItemViewProps) {
  const { style, titleChunks, contentChunks } = props

  const dark = useThemeDark()
  const backgroundColor = dark ? colors.black : colors.white

  const { text, text2, tint } = useThemeScheme()

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.wrapper}>
        <View style={{ flex: 1, marginRight: dimensions.edgeTwice }}>
          <ChunksText
            style={[styles.title, { color: text }]}
            numberOfLines={1}
            chunks={titleChunks}
          />
          <ChunksText
            style={[styles.content, { color: text2 }]}
            numberOfLines={1}
            chunks={contentChunks}
          />
        </View>
        <SvgIcon size={dimensions.iconMedium} color={tint} name="navigate-next" />
      </View>
      <Seperator />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  wrapper: ViewStyle
  title: TextStyle
  content: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
  },
  wrapper: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    width: '100%',
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    width: '100%',
    fontSize: 14,
    marginTop: 2,
  },
})

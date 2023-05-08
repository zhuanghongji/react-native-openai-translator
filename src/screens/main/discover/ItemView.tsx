import { SvgIcon } from '../../../components/SvgIcon'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import { Seperator } from './Seperator'
import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type ItemViewProps = {
  style?: StyleProp<ViewStyle>
  title: string
  content: string
  filterText?: string
}

function splitTitle(value: string, splitter: string | undefined): [string, string, string] {
  if (!splitter) {
    return [value, '', '']
  }
  const index = Math.max(0, value.toLowerCase().indexOf(splitter.toLocaleLowerCase()))
  const indexEnd = index + splitter.length
  const left = value.substring(0, index)
  const center = value.substring(index, indexEnd)
  const right = value.substring(indexEnd)
  return [left, center, right]
}

function splitContent(value: string, splitter: string | undefined): [string, string, string] {
  if (!splitter) {
    return [value, '', '']
  }
  const index = Math.max(0, value.toLowerCase().indexOf(splitter.toLocaleLowerCase()))
  const indexEnd = index + splitter.length
  const left = value.substring(Math.max(0, index - 20), index)
  const center = value.substring(index, indexEnd)
  const right = value.substring(indexEnd, index + 120)
  return [left ? `...${left}` : '', center, right]
}

export function ItemView(props: ItemViewProps) {
  const { style, title, content, filterText } = props

  const { text, text2, tint } = useThemeScheme()
  const [titleLeft, titleCenter, titleRight] = useMemo(
    () => splitTitle(title, filterText),
    [title, filterText]
  )
  const [contentLeft, contentCenter, contentRight] = useMemo(
    () => splitContent(content, filterText),
    [content, filterText]
  )

  return (
    <View style={[styles.container, style]}>
      <View style={styles.wrapper}>
        <View style={{ flex: 1, marginRight: dimensions.edgeTwice }}>
          <Text style={[styles.title, { color: text }]} numberOfLines={1}>
            <Text>{titleLeft}</Text>
            <Text style={{ color: colors.primary }}>{titleCenter}</Text>
            <Text>{titleRight}</Text>
          </Text>
          <Text style={[styles.content, { color: text2 }]} numberOfLines={1}>
            <Text>{contentLeft}</Text>
            <Text style={{ color: colors.primary }}>{contentCenter}</Text>
            <Text>{contentRight}</Text>
          </Text>
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

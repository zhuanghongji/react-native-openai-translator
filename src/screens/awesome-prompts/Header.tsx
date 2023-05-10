import { FilterInput } from '../../components/FilterInput'
import { dimensions } from '../../res/dimensions'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type HeaderProps = {
  style?: StyleProp<ViewStyle>
  filterText: string
  onFilterTextChange: (value: string) => void
}

export function Header(props: HeaderProps) {
  const { style, filterText, onFilterTextChange } = props

  return (
    <View style={[styles.container, style]}>
      <FilterInput value={filterText} onChangeText={onFilterTextChange} />
    </View>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    marginBottom: dimensions.edge,
  },
})

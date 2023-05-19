import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeSelector } from '../../themes/hooks'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'

export type EditListViewProps<ItemT> = {
  style?: StyleProp<ViewStyle>
  data: ItemT[]
}

export function EditListView<ItemT>(props: EditListViewProps<ItemT>) {
  const { style, data } = props

  const color = useThemeSelector(colors.white, colors.black)

  return (
    <BottomSheetFlatList
      style={[styles.container, style]}
      data={data}
      renderItem={() => {
        return null
      }}
    />
  )
}

type Styles = {
  container: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    fontSize: 16,
  },
})

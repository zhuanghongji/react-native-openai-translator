import { T_CUSTOM_CHAT_BASIC_DEFAULT } from '../../db/table/t-custom-chat'
import { Divider } from '../Divider'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useMemo, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditFontSizeDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: number | null
  onValueChange: (value: number) => void
}

export function EditFontSizeDetailView(props: EditFontSizeDetailViewProps) {
  const { style, value, onValueChange } = props

  const { bottom: bottomInset } = useSafeAreaInsets()

  const [fontSize, setFontSize] = useState(value ?? T_CUSTOM_CHAT_BASIC_DEFAULT.font_size)
  const actionDisabled = value === fontSize

  const data = useMemo(() => {
    const result: number[] = []
    for (let i = 10; i < 33; i++) {
      result.push(i)
    }
    return result
  }, [])

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Font Size"
        actionDisabled={actionDisabled}
        onActionPress={() => onValueChange(fontSize)}
      />
      <BottomSheetFlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === T_CUSTOM_CHAT_BASIC_DEFAULT.font_size ? ' (default)' : ''
          return (
            <EditItemView
              title={`${item}${Platform.OS === 'ios' ? ' pt' : ' dp'}`}
              subtitle={subtitle}
              selected={item === fontSize}
              onPress={() => setFontSize(item)}
            />
          )
        }}
        ListHeaderComponent={Divider}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={Divider}
      />
    </View>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
})

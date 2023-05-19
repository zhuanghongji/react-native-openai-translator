import { T_CUSTOM_CHAT_BASIC_DEFAULT } from '../../db/table/t-custom-chat'
import { Divider } from '../Divider'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useMemo, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditTemperatureValueDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string | null
  onValueChange: (value: string) => void
}

export function EditTemperatureValueDetailView(props: EditTemperatureValueDetailViewProps) {
  const { style, value, onValueChange } = props

  const { bottom: bottomInset } = useSafeAreaInsets()

  const [temperature, setTemperature] = useState(value ?? T_CUSTOM_CHAT_BASIC_DEFAULT.temperature)
  const actionDisabled = value === temperature

  const data = useMemo(() => {
    const result: string[] = []
    for (let i = 0; i < 2.2; i += 0.2) {
      result.push(i.toFixed(1))
    }
    return result
  }, [])

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Temperature Value"
        actionDisabled={actionDisabled}
        onActionPress={() => onValueChange(temperature)}
      />
      <BottomSheetFlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === T_CUSTOM_CHAT_BASIC_DEFAULT.temperature ? ' (default)' : ''
          return (
            <EditItemView
              title={item}
              subtitle={subtitle}
              selected={item === temperature}
              onPress={() => setTemperature(item)}
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

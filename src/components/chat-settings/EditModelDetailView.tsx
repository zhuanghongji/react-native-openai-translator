import { API_MODELS } from '../../preferences/options'
import { Divider } from '../Divider'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditModelDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string
  onValueChange: (value: string) => void
}

export function EditModelDetailView(props: EditModelDetailViewProps) {
  const { style, value, onValueChange } = props

  const { bottom: bottomInset } = useSafeAreaInsets()

  const [model, setModel] = useState(value)
  const actionDisabled = value === model

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Model"
        actionDisabled={actionDisabled}
        onActionPress={() => onValueChange(model)}
      />
      <BottomSheetFlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={API_MODELS}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          return (
            <EditItemView title={item} selected={item === model} onPress={() => setModel(item)} />
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

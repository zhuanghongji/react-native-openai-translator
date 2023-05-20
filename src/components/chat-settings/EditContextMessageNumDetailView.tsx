import { DEFAULTS } from '../../preferences/defaults'
import { Divider } from '../Divider'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useMemo, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditContextMessageNumDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: number
  onValueChange: (value: number) => void
  onBackNotify: () => void
}

export function EditContextMessageNumDetailView(props: EditContextMessageNumDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const { bottom: bottomInset } = useSafeAreaInsets()

  const [contextMessagesNum, setContextMessagesNum] = useState(value)
  const actionDisabled = value === contextMessagesNum

  const data = useMemo(() => {
    const result: number[] = []
    for (let i = 0; i < 10; i++) {
      result.push(i)
    }
    result.push(100)
    return result
  }, [])

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Context Message Num"
        actionDisabled={actionDisabled}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(contextMessagesNum)}
      />
      <BottomSheetFlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === DEFAULTS.contextMessagesNum ? ' (default)' : ''
          return (
            <EditItemView
              title={`${item}`}
              subtitle={subtitle}
              selected={item === contextMessagesNum}
              onPress={() => setContextMessagesNum(item)}
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

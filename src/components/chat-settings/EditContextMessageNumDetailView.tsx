import { T_CUSTOM_CHAT_BASIC_DEFAULT } from '../../db/table/t-custom-chat'
import { Divider } from '../Divider'
import { EditItemView } from './EditItemView'
import { useSettingsSelectorContext } from './SettingsSelectorProvider'
import { SettingsTitleBar } from './SettingsTitleBar'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useMemo, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditContextMessageNumDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: number | null
  onValueChange: (value: number) => void
}

export function EditContextMessageNumDetailView(props: EditContextMessageNumDetailViewProps) {
  const { style, value, onValueChange } = props

  const { bottom: bottomInset } = useSafeAreaInsets()
  const { handleBackPress } = useSettingsSelectorContext()

  const [contextMessagesNum, setContextMessagesNum] = useState(
    value ?? T_CUSTOM_CHAT_BASIC_DEFAULT.context_num
  )
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
        onActionPress={() => onValueChange(contextMessagesNum)}
      />
      <BottomSheetFlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === T_CUSTOM_CHAT_BASIC_DEFAULT.context_num ? ' (default)' : ''
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

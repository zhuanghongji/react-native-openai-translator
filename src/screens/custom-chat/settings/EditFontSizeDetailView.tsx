import { Divider } from '../../../components/Divider'
import { DEFAULTS } from '../../../preferences/defaults'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useMemo, useState } from 'react'
import { FlatList, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditFontSizeDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: number
  onValueChange: (value: number) => void
  onBackNotify: () => void
}

export function EditFontSizeDetailView(props: EditFontSizeDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const { bottom: bottomInset } = useSafeAreaInsets()

  const [fontSize, setFontSize] = useState(value)
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
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(fontSize)}
      />
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === DEFAULTS.fontSize ? ' (default)' : ''
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

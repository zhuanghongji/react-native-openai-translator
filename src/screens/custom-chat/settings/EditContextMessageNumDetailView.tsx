import { Divider } from '../../../components/Divider'
import { DEFAULTS } from '../../../preferences/defaults'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditContextMessageNumDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: number
  onValueChange: (value: number) => void
  onBackNotify: () => void
}

export function EditContextMessageNumDetailView(props: EditContextMessageNumDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const { t } = useTranslation()
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
        title={t('Context Messages Number')}
        actionDisabled={actionDisabled}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(contextMessagesNum)}
      />
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === DEFAULTS.contextMessagesNum ? ` (${t('default')})` : ''
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

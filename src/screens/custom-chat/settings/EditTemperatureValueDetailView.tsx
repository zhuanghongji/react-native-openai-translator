import { Divider } from '../../../components/Divider'
import { DEFAULTS } from '../../../preferences/defaults'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditTemperatureValueDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: number
  onValueChange: (value: number) => void
  onBackNotify: () => void
}

export function EditTemperatureValueDetailView(props: EditTemperatureValueDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const { t } = useTranslation()
  const { bottom: bottomInset } = useSafeAreaInsets()

  const [temperature, setTemperature] = useState(value)
  const actionDisabled = value === temperature

  const data = useMemo(() => {
    const result: number[] = []
    for (let i = 0; i < 2.2; i += 0.2) {
      result.push(i)
    }
    return result
  }, [])

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title={t('Temperature Value')}
        actionDisabled={actionDisabled}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(temperature)}
      />
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={data}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === DEFAULTS.apiTemperature ? ' (default)' : ''
          return (
            <EditItemView
              title={`${item.toFixed(1)}`}
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

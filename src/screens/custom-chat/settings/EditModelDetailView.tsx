import { Divider } from '../../../components/Divider'
import { DEFAULTS } from '../../../preferences/defaults'
import { API_MODELS } from '../../../preferences/options'
import { EditItemView } from './EditItemView'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type EditModelDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string
  onValueChange: (value: string) => void
  onBackNotify: () => void
}

export function EditModelDetailView(props: EditModelDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const { t } = useTranslation()
  const { bottom: bottomInset } = useSafeAreaInsets()

  const [model, setModel] = useState(value)
  const actionDisabled = value === model

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title={t('Model')}
        actionDisabled={actionDisabled}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(model)}
      />
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
        data={API_MODELS}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const subtitle = item === DEFAULTS.apiModel ? ` (${t('default')})` : ''
          return (
            <EditItemView
              title={item}
              subtitle={subtitle}
              selected={item === model}
              onPress={() => setModel(item)}
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

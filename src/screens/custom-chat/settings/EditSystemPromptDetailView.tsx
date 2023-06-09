import { Input } from '../../../components/Input'
import { dimensions } from '../../../res/dimensions'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditSystemPromptDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string | null
  fontSize: number
  onValueChange: (value: string) => void
  onBackNotify: () => void
}

export function EditSystemPromptDetailView(props: EditSystemPromptDetailViewProps) {
  const { style, value, fontSize, onValueChange, onBackNotify } = props

  const { t } = useTranslation()

  const [systemPrompt, setSystemPrompt] = useState(value ?? '')

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title={t('System Prompt')}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(systemPrompt.trim())}
      />
      <Input
        style={styles.text}
        textStyle={{ fontSize }}
        multiline={true}
        autoFocus={true}
        placeholder={`${t('System Prompt')} ...`}
        returnKeyType="done"
        value={systemPrompt}
        onChangeText={setSystemPrompt}
      />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  text: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  text: {
    marginTop: dimensions.edge,
    marginHorizontal: dimensions.edgeTwice,
    maxHeight: 128,
    textAlign: 'justify',
  },
})

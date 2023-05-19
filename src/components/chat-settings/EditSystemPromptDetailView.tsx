import { dimensions } from '../../res/dimensions'
import { Input } from '../Input'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditSystemPromptDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string | null
  onValueChange: (value: string) => void
}

export function EditSystemPromptDetailView(props: EditSystemPromptDetailViewProps) {
  const { style, value, onValueChange } = props

  const [systemPrompt, setSystemPrompt] = useState('')
  const actionDisabled = value === systemPrompt

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit System Prompt"
        actionDisabled={actionDisabled}
        onActionPress={() => onValueChange(systemPrompt.trim())}
      />
      <Input
        style={{ marginTop: dimensions.edge, marginHorizontal: dimensions.edgeTwice }}
        autoFocus={true}
        placeholder="System Prompt ..."
        returnKeyType="done"
        value={systemPrompt}
        onChangeText={setSystemPrompt}
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

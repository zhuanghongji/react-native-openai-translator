import { dimensions } from '../../res/dimensions'
import { Input } from '../Input'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditChatNameDetialViewProps = {
  style?: StyleProp<ViewStyle>
  value: string | null
  onValueChange: (value: string) => void
}

export function EditChatNameDetialView(props: EditChatNameDetialViewProps) {
  const { style, value, onValueChange } = props

  const [chatName, setChatName] = useState('')
  const actionDisabled = value === chatName

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Chat Name"
        actionDisabled={actionDisabled}
        onActionPress={() => onValueChange(chatName.trim())}
      />
      <Input
        style={{ marginTop: dimensions.edge, marginHorizontal: dimensions.edgeTwice }}
        autoFocus={true}
        placeholder="Chat Name ..."
        returnKeyType="done"
        value={chatName}
        onChangeText={setChatName}
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

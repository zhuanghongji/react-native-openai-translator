import { Input } from '../../../components/Input'
import { dimensions } from '../../../res/dimensions'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditChatNameDetialViewProps = {
  style?: StyleProp<ViewStyle>
  value: string | null
  fontSize: number
  onValueChange: (value: string) => void
  onBackNotify: () => void
}

export function EditChatNameDetialView(props: EditChatNameDetialViewProps) {
  const { style, value, fontSize, onValueChange, onBackNotify } = props

  const { t } = useTranslation()

  const [chatName, setChatName] = useState(value ?? '')

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title={t('Chat Name')}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(chatName.trim())}
      />
      <Input
        style={styles.text}
        textStyle={{ fontSize }}
        autoFocus={true}
        placeholder={`${t('Chat Name')} ...`}
        returnKeyType="done"
        value={chatName}
        onChangeText={setChatName}
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
  },
})

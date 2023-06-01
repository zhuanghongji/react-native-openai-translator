import { dimensions } from '../res/dimensions'
import { toast } from '../toast'
import { Button } from './Button'
import { EmojiAvatar } from './EmojiAvatar'
import { Input } from './Input'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export type ChatInfoEditViewProps = {
  style?: StyleProp<ViewStyle>
  avatar: string
  chatName: string
  systemPrompt: string
  confirmDisabled?: boolean
  onAvatarPress: () => void
  onChatNameChange: (value: string) => void
  onSystemPromptChange: (value: string) => void
  onConfirmPress: () => void
  onSkipPress: () => void
}

export function ChatInfoEditView(props: ChatInfoEditViewProps) {
  const {
    style,
    avatar,
    chatName,
    systemPrompt,
    confirmDisabled = false,
    onAvatarPress,
    onChatNameChange,
    onSystemPromptChange,
    onConfirmPress,
    onSkipPress,
  } = props

  const { t } = useTranslation()

  const nameInputRef = useRef<TextInput>(null)
  const presetInputRef = useRef<TextInput>(null)

  const { width: frameWidth } = useSafeAreaFrame()
  const width = frameWidth - dimensions.edgeTwice * 2
  const divider = <View style={{ height: dimensions.edge }} />

  return (
    <View style={[styles.container, { width }, style]}>
      <EmojiAvatar
        style={{ marginBottom: dimensions.edgeTwice }}
        value={avatar}
        onPress={onAvatarPress}
      />
      <Input
        ref={nameInputRef}
        autoFocus={true}
        value={chatName}
        placeholder={`${t('Chat Name')} ...`}
        returnKeyType="next"
        onChangeText={onChatNameChange}
        onSubmitEditing={() => presetInputRef.current?.focus()}
      />
      {divider}
      <Input
        ref={presetInputRef}
        value={systemPrompt}
        placeholder={`${t('System Prompt')} ...`}
        returnKeyType="done"
        onChangeText={onSystemPromptChange}
        onSubmitEditing={() => {
          if (!chatName) {
            toast('danger', 'Invaid Chat Name', 'Please input valid chat name')
            nameInputRef.current?.focus()
            return
          }
          onConfirmPress()
        }}
      />
      {divider}
      {divider}
      <Button
        style={{ width }}
        disabled={confirmDisabled}
        text={t('CONFIRM')}
        onPress={onConfirmPress}
      />
      <Button
        style={{ width: 48, marginTop: dimensions.edge }}
        plain={true}
        text={t('SKIP')}
        onPress={onSkipPress}
      />
    </View>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

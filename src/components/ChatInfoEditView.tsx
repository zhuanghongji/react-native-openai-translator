import { dimensions } from '../res/dimensions'
import { toast } from '../toast'
import { Button } from './Button'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export type ChatInfoEditViewProps = {
  style?: StyleProp<ViewStyle>
  chatName: string
  systemPrompt: string
  confirmDisabled?: boolean
  onChatNameChange: (value: string) => void
  onSystemPromptChange: (value: string) => void
  onConfirmPress: () => void
  onSkipPress: () => void
}

export function ChatInfoEditView(props: ChatInfoEditViewProps) {
  const {
    style,
    chatName,
    systemPrompt,
    confirmDisabled = false,
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
      <TextInput
        ref={nameInputRef}
        style={styles.input}
        autoFocus={true}
        value={chatName}
        placeholder="Chat Name ..."
        returnKeyType="next"
        onChangeText={onChatNameChange}
        onSubmitEditing={() => presetInputRef.current?.focus()}
      />
      {divider}
      <TextInput
        ref={presetInputRef}
        style={styles.input}
        value={systemPrompt}
        placeholder="System Prompt ..."
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
      <Button style={{ width }} plain={true} text={t('SKIP')} onPress={onSkipPress} />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  input: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: dimensions.edgeTwice,
    borderRadius: dimensions.borderRadius,
    paddingVertical: 8,
  },
})

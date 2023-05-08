import { AvoidKeyboardView } from '../../components/AvoidKeyboardView'
import { ChatInfoEditView } from '../../components/ChatInfoEditView'
import { TitleBar } from '../../components/TitleBar'
import { hapticSuccess } from '../../haptic'
import { dimensions } from '../../res/dimensions'
import type { RootStackParamList } from '../screens'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'CustomChatInit'>

export function CustomChatInitScreen({ navigation }: Props): JSX.Element {
  const [chatName, setChatName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')

  const title = chatName ? chatName : systemPrompt ? 'Unnamed' : 'Initialize Chat'
  const subtitle = systemPrompt ? systemPrompt : ''
  const confirmDisabled = chatName ? false : true

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TitleBar title={title} subtitle={subtitle} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <AvoidKeyboardView factor={0.5}>
          <ChatInfoEditView
            chatName={chatName}
            systemPrompt={systemPrompt}
            confirmDisabled={confirmDisabled}
            onChatNameChange={setChatName}
            onSystemPromptChange={setSystemPrompt}
            onConfirmPress={() => {
              hapticSuccess()
              navigation.replace('CustomChat', { chatName, systemPrompt })
            }}
            onSkipPress={() => {}}
          />
        </AvoidKeyboardView>
      </ScrollView>
    </SafeAreaView>
  )
}

type Styles = {
  modes: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  modes: {
    flexDirection: 'row',
    gap: dimensions.gap,
    marginRight: dimensions.edge,
  },
})

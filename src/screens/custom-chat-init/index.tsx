import { AvoidKeyboardView } from '../../components/AvoidKeyboardView'
import { ChatInfoEditView } from '../../components/ChatInfoEditView'
import { TitleBar } from '../../components/TitleBar'
import {
  DEFAULT_CUSTOM_CHAT,
  dbFindCustomChatById,
  dbInsertCustomChat,
} from '../../db/table/t-custom-chat'
import { hapticSuccess } from '../../haptic'
import { toast } from '../../toast'
import type { RootStackParamList } from '../screens'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'CustomChatInit'>

export function CustomChatInitScreen({ navigation }: Props): JSX.Element {
  const [chatName, setChatName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')

  const title = chatName ? chatName : systemPrompt ? 'Unnamed' : 'Initialize Chat'
  const subtitle = systemPrompt ? systemPrompt : ''
  const confirmDisabled = chatName ? false : true

  const onComfirmPress = async () => {
    try {
      hapticSuccess()
      const { insertId } = await dbInsertCustomChat({
        ...DEFAULT_CUSTOM_CHAT,
        title: chatName.trim(),
        system_prompt: systemPrompt.trim(),
      })
      if (insertId === undefined) {
        toast('danger', 'Error', 'Initialize Chat Error 1')
        return
      }
      const result = await dbFindCustomChatById(insertId)
      const [insertChat] = result.rows._array
      navigation.replace('CustomChat', { chat: insertChat })
    } catch (e) {
      toast('danger', 'Error', 'Initialize Chat Error 2')
    }
  }

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
            onConfirmPress={onComfirmPress}
            onSkipPress={() => {}}
          />
        </AvoidKeyboardView>
      </ScrollView>
    </SafeAreaView>
  )
}

// type Styles = {
//   modes: ViewStyle
// }

// const styles = StyleSheet.create<Styles>({
//   modes: {
//     flexDirection: 'row',
//     gap: dimensions.gap,
//     marginRight: dimensions.edge,
//   },
// })

import { AvoidKeyboardView } from '../../components/AvoidKeyboardView'
import { ChatInfoEditView } from '../../components/ChatInfoEditView'
import { EmojisModal, EmojisModalHandle } from '../../components/EmojisModal'
import { TitleBar } from '../../components/TitleBar'
import { DEFAULT_T_CUSTOM_CHAT_BASIC } from '../../db/constants'
import { dbFindCustomChatById, dbInsertCustomChat } from '../../db/table/t-custom-chat'
import { hapticSuccess, hapticWarning } from '../../haptic'
import { DEFAULTS } from '../../preferences/defaults'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { useCustomChatSettingsStore } from '../../zustand/stores/custom-chat-settings'
import type { RootStackParamList } from '../screens'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, ScrollView } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const SNAP_HEIGHT = 420

type Props = NativeStackScreenProps<RootStackParamList, 'CustomChatInit'>

export function CustomChatInitScreen({ navigation }: Props): JSX.Element {
  const [avatar, setAvatar] = useState(DEFAULTS.avatar)
  const [chatName, setChatName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')

  const { t } = useTranslation()
  const { background: backgroundColor } = useThemeScheme()

  const confirmDisabled = chatName ? false : true

  const emojisModalRef = useRef<EmojisModalHandle>(null)
  const animatedIndex = useSharedValue(-1)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -(animatedIndex.value + 1) * SNAP_HEIGHT * 0.45,
        },
      ],
    }
  })

  const batchChat = useCustomChatSettingsStore(state => state.batchChat)
  const onComfirmPress = async () => {
    try {
      const { insertId } = await dbInsertCustomChat({
        ...DEFAULT_T_CUSTOM_CHAT_BASIC,
        chat_name: chatName.trim(),
        system_prompt: systemPrompt.trim(),
      })
      if (insertId === undefined) {
        toast('danger', 'Error', 'Initialize Chat Error 1')
        return
      }
      const result = await dbFindCustomChatById(insertId)
      hapticSuccess()
      const [insertChat] = result.rows._array
      batchChat([insertChat])
      navigation.replace('CustomChat', { chat: insertChat })
    } catch (e) {
      hapticWarning()
      toast('danger', 'Error', 'Initialize Chat Error 2')
    }
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
        <TitleBar title={t('Create New Chat')} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled">
          <Animated.View style={animatedStyle}>
            <AvoidKeyboardView factor={0.4}>
              <ChatInfoEditView
                avatar={avatar}
                chatName={chatName}
                systemPrompt={systemPrompt}
                confirmDisabled={confirmDisabled}
                onAvatarPress={() => {
                  emojisModalRef.current?.show()
                  Keyboard.dismiss()
                }}
                onChatNameChange={setChatName}
                onSystemPromptChange={setSystemPrompt}
                onConfirmPress={onComfirmPress}
                onSkipPress={onComfirmPress}
              />
            </AvoidKeyboardView>
          </Animated.View>
        </ScrollView>

        <EmojisModal
          ref={emojisModalRef}
          snapHeight={SNAP_HEIGHT}
          animatedIndex={animatedIndex}
          onEmojiPress={setAvatar}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

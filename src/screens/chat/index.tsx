import { hapticError, hapticSuccess } from '../../haptic'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import {
  useApiKeyPref,
  useApiUrlPathPref,
  useApiUrlPref,
} from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import { ChatMessage, Message } from '../../types'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import { RootStackParamList } from '../screens'
import { InputBar } from './InputBar'
import { TitleBar } from './TitleBar'
import { AssistantMessageView } from './message-view/AssistantMessageView'
import { SSEMessageView } from './message-view/SSEMessageView'
import { UserMessageView } from './message-view/UserMessageView'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native'
import {
  KeyboardEvents,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>

export function ChatScreen({ navigation, route }: Props): JSX.Element {
  const { translatorMode, systemPrompt, userContent, assistantContent } =
    route.params

  const backgroundColor = useThemeColor('backgroundChat')

  const flashListRef = useRef<FlashList<ChatMessage>>(null)
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', e => {
      flashListRef.current?.scrollToIndex({ index: 0 })
    })
    return () => {
      show.remove()
    }
  }, [])

  const { height } = useReanimatedKeyboardAnimation()
  const transformStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }],
    }),
    []
  )

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!userContent || !assistantContent) {
      return []
    }
    return [
      {
        role: 'assistant',
        content: assistantContent,
      },
      {
        role: 'user',
        content: userContent,
      },
    ]
  })
  const [inputText, setInputText] = useState('')

  const status = useSSEMessageStore(state => state.status)
  const sendDisabled = inputText.trim() && status !== 'sending' ? false : true
  const setStatus = useSSEMessageStore(state => state.setStatus)
  const setContent = useSSEMessageStore(state => state.setContent)

  const [apiUrl] = useApiUrlPref()
  const [apiUrlPath] = useApiUrlPathPref()
  const [apiKey] = useApiKeyPref()

  const onSendPress = () => {
    setInputText('')
    const nextMessages: ChatMessage[] = [
      { role: 'user', content: inputText },
      ...messages,
    ]
    setMessages(nextMessages)

    const messagesToSend: Message[] = nextMessages
      .map(({ role, content }) => ({
        role,
        content,
      }))
      .reverse()
    if (systemPrompt) {
      messagesToSend.unshift({ role: 'system', content: systemPrompt })
    }
    setStatus('sending')
    sseRequestChatCompletions(
      {
        apiUrl,
        apiUrlPath,
        apiKey,
        messages: messagesToSend,
      },
      {
        onSubscribe: () => {},
        onNext: content => {
          setContent(content)
        },
        onTimeout: () => {
          setStatus('done')
          hapticError()
        },
        onError: message => {
          setStatus('done')
          hapticError()
        },
        onDone: message => {
          setMessages(prev => [
            { role: 'assistant', content: message.content },
            ...prev,
          ])
          setStatus('done')
          setContent('')
          hapticSuccess()
        },
        onComplete: () => {},
      }
    )
  }

  const renderItemSeparator = () => {
    return <View style={{ height: dimensions.edge * 2 }} />
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={['left', 'right']}>
      <TitleBar
        mode={translatorMode}
        systemPrompt={systemPrompt}
        onBackPress={() => {
          navigation.goBack()
        }}
        onMorePress={() => {}}
      />
      <Animated.View style={[{ flex: 1, overflow: 'hidden' }]}>
        <Animated.View style={[{ flex: 1 }, transformStyle]}>
          <FlashList
            ref={flashListRef}
            contentContainerStyle={{ paddingVertical: dimensions.edge }}
            inverted={true}
            // data={TEST_CHAT_MESSAGES}
            data={messages}
            getItemType={item => item.role}
            keyExtractor={(item, index) =>
              `${index}_${item.role}_${item.content}`
            }
            renderItem={({ item }) => {
              if (item.role === 'user') {
                return <UserMessageView message={item} />
              }
              if (item.role === 'assistant') {
                return <AssistantMessageView message={item} />
              }
              return null
            }}
            ItemSeparatorComponent={renderItemSeparator}
            ListHeaderComponent={<SSEMessageView />}
            estimatedItemSize={200}
            onScrollBeginDrag={() => {
              Keyboard.dismiss()
            }}
          />
        </Animated.View>
      </Animated.View>
      <InputBar
        value={inputText}
        sendDisabled={sendDisabled}
        onChangeText={setInputText}
        onSendPress={onSendPress}
      />
    </SafeAreaView>
  )
}

type Styles = {
  scanArea: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  scanArea: {},
})

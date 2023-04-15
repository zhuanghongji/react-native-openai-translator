import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { InputBar } from '../../components/chat/InputBar'
import { SSEMessageView } from '../../components/chat/SSEMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { workletClamp } from '../../extensions/reanimated'
import { hapticError, hapticSuccess } from '../../haptic'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { useApiKeyPref, useApiUrlPathPref, useApiUrlPref } from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import { ChatMessage, Message } from '../../types'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import { RootStackParamList } from '../screens'
import { TitleBar } from './TitleBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { KeyboardEvents, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'ModeChat'>

export function ModeChatScreen({ navigation, route }: Props): JSX.Element {
  const { translatorMode, systemPrompt, userContent, assistantContent } = route.params

  const [apiUrl] = useApiUrlPref()
  const [apiUrlPath] = useApiUrlPathPref()
  const [apiKey] = useApiKeyPref()
  const backgroundColor = useThemeColor('backgroundChat')

  const listContainerHeight = useSharedValue(0)
  const listContentHeight = useSharedValue(0)
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation()
  const transformStyle = useAnimatedStyle(() => {
    const kbHeight = Math.abs(keyboardHeight.value)
    const contentHeight = listContentHeight.value
    const containerHeight = listContainerHeight.value
    const offset = workletClamp(contentHeight - (containerHeight - kbHeight), 0, kbHeight)
    return {
      transform: [{ translateY: -offset }],
    }
  }, [])

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!userContent || !assistantContent) {
      return []
    }
    return [
      {
        role: 'user',
        content: userContent,
      },
      {
        role: 'assistant',
        content: assistantContent,
      },
    ]
  })

  const flashListRef = useRef<FlashList<ChatMessage>>(null)
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', () => {
      if (messages.length > 0) {
        flashListRef.current?.scrollToEnd()
      }
    })
    return () => show.remove()
  }, [messages.length])

  const [inputText, setInputText] = useState('')

  const status = useSSEMessageStore(state => state.status)
  const sendDisabled = inputText.trim() && status !== 'sending' ? false : true
  const setStatus = useSSEMessageStore(state => state.setStatus)
  const setContent = useSSEMessageStore(state => state.setContent)

  const onSendPress = () => {
    setInputText('')
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: inputText }]
    setMessages(nextMessages)

    const messagesToSend: Message[] = nextMessages.map(({ role, content }) => ({
      role,
      content,
    }))
    if (systemPrompt) {
      messagesToSend.push({ role: 'system', content: systemPrompt })
    }
    setTimeout(() => flashListRef.current?.scrollToEnd(), 200)
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
          setMessages(prev => [...prev, { role: 'assistant', content: message.content }])
          setStatus('done')
          setContent('')
          hapticSuccess()
          setTimeout(() => flashListRef.current?.scrollToEnd(), 200)
        },
        onComplete: () => {},
      }
    )
  }

  const renderItemSeparator = () => {
    return <View style={{ height: dimensions.messageSeparator }} />
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['left', 'right']}>
      <TitleBar
        mode={translatorMode}
        systemPrompt={systemPrompt}
        onBackPress={() => {
          navigation.goBack()
        }}
        onMorePress={() => {}}
      />
      <Animated.View style={[{ flex: 1, overflow: 'hidden' }]}>
        <Animated.View
          style={[{ flex: 1 }, transformStyle]}
          onLayout={e => {
            listContainerHeight.value = e.nativeEvent.layout.height
          }}>
          <FlashList
            ref={flashListRef}
            contentContainerStyle={{
              paddingVertical: dimensions.messageSeparator,
            }}
            data={messages}
            getItemType={item => item.role}
            keyExtractor={(item, index) => `${index}_${item.role}_${item.content}`}
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
            ListFooterComponent={<SSEMessageView />}
            estimatedItemSize={200}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            onContentSizeChange={(_, h) => (listContentHeight.value = h)}
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

import { TitleBar } from '../../components/TitleBar'
import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { InputBar } from '../../components/chat/InputBar'
import { SSEMessageView } from '../../components/chat/SSEMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { workletClamp } from '../../extensions/reanimated'
import { hapticError, hapticSuccess } from '../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { TranslatorMode } from '../../preferences/options'
import { useHideChatAvatarPref } from '../../preferences/storages'
import { print } from '../../printer'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { ChatMessage, Message } from '../../types'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import { RootStackParamList } from '../screens'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { KeyboardEvents, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import EventSource from 'react-native-sse'

type Props = NativeStackScreenProps<RootStackParamList, 'ModeChat'>

function useTitle(mode: TranslatorMode) {
  const { t } = useTranslation()
  if (mode === 'translate') {
    return t('Translate Chat')
  }
  if (mode === 'polishing') {
    return t('Polishing Chat')
  }
  if (mode === 'summarize') {
    return t('Summarize Chat')
  }
  if (mode === 'analyze') {
    return t('Analyze Chat')
  }
  return t('Bubble Chat')
}

export function ModeChatScreen({ navigation, route }: Props): JSX.Element {
  const { translatorMode, systemPrompt, userContent, assistantContent } = route.params
  const title = useTitle(translatorMode)

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()

  const { backgroundChat: backgroundColor } = useThemeScheme()
  const [hideChatAvatar] = useHideChatAvatarPref()

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
  const messagesInverted = useMemo(() => {
    return [...messages].reverse()
  }, [messages])

  const flashListRef = useRef<FlashList<ChatMessage>>(null)
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', () => {
      if (messages.length > 0) {
        flashListRef.current?.scrollToOffset({ offset: 0, animated: true })
      }
    })
    return () => show.remove()
  }, [messages.length])

  const [inputText, setInputText] = useState('')

  const status = useSSEMessageStore(state => state.status)
  const sendDisabled = inputText.trim() && status !== 'sending' ? false : true
  const setStatus = useSSEMessageStore(state => state.setStatus)
  const setContent = useSSEMessageStore(state => state.setContent)

  const esRef = useRef<EventSource | undefined>(undefined)
  const esRequesting = useRef(false)
  useEffect(() => {
    print('esRequesting.current = ' + esRequesting.current)
    if (esRequesting.current) {
      esRef.current?.close()
      setStatus('none')
    }
  }, [setStatus])
  const onSendPress = () => {
    if (!checkIsOptionsValid()) {
      return
    }
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
    setTimeout(() => flashListRef.current?.scrollToOffset({ offset: 0, animated: true }), 200)
    setStatus('sending')
    esRequesting.current = true
    esRef.current?.close()
    esRef.current = sseRequestChatCompletions(urlOptions, customizedOptions, messagesToSend, {
      onNext: content => {
        setContent(content)
        flashListRef.current?.scrollToOffset({ offset: 0, animated: true })
      },
      onError: (code, message) => {
        setStatus('complete')
        hapticError()
        toast('warning', code, message)
      },
      onDone: message => {
        setMessages(prev => [...prev, { role: 'assistant', content: message.content }])
        setStatus('complete')
        setContent('')
        hapticSuccess()
        setTimeout(() => flashListRef.current?.scrollToOffset({ offset: 0, animated: true }), 200)
      },
      onComplete: () => {
        esRequesting.current = false
      },
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['left', 'right']}>
      <TitleBar
        title={title}
        subtitle={systemPrompt}
        action={{
          iconName: 'tune',
          onPress: () => toast('success', 'Teaser', 'Chat fine-tuning will be support later'),
        }}
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
              paddingTop: dimensions.messageSeparator,
            }}
            inverted={true}
            data={messagesInverted}
            getItemType={item => item.role}
            keyExtractor={(item, index) => `${index}_${item.role}_${item.content}`}
            renderItem={({ item }) => {
              if (item.role === 'user') {
                return (
                  <UserMessageView
                    style={{ marginVertical: dimensions.messageSeparator }}
                    hideChatAvatar={hideChatAvatar}
                    message={item}
                  />
                )
              }
              if (item.role === 'assistant') {
                return <AssistantMessageView hideChatAvatar={hideChatAvatar} message={item} />
              }
              return null
            }}
            // Do not use it because of https://github.com/Shopify/flash-list/issues/638
            // ItemSeparatorComponent={renderItemSeparator}
            ListHeaderComponent={<SSEMessageView hideChatAvatar={hideChatAvatar} />}
            estimatedItemSize={200}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            onContentSizeChange={(_, h) => (listContentHeight.value = h)}
            onEndReached={() => console.log('onEndReached')}
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

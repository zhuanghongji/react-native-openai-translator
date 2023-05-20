import { TitleBar } from '../../components/TitleBar'
import {
  SettingsSelectorModal,
  SettingsSelectorModalHandle,
} from '../../components/chat-settings/SettingsSelectorModal'
import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { AppDividerView } from '../../components/chat/DividerMessageView'
import { InputBar } from '../../components/chat/InputBar'
import { SSEMessageView } from '../../components/chat/SSEMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { DEFAULT_T_RESULT_EXTRA, fillTCustomChatWithDefaults } from '../../db/helper'
import { dbUpdateCustomChatWhere } from '../../db/table/t-custom-chat'
import {
  dbDeleteCustomChatMessageOfChatId,
  dbInsertCustomMessage,
  dbSelectCustomChatMessageOfChatId,
} from '../../db/table/t-custom-chat-message'
import { hapticError, hapticSuccess } from '../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { useHideChatAvatarPref } from '../../preferences/storages'
import { print } from '../../printer'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { ChatMessage, Message } from '../../types'
import {
  updateCustomChatSettings,
  useCustomChatSettings,
} from '../../zustand/stores/custom-chat-settings-helper'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import type { RootStackParamList } from '../screens'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, View } from 'react-native'
import { KeyboardEvents, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import EventSource from 'react-native-sse'

type Props = NativeStackScreenProps<RootStackParamList, 'CustomChat'>

export function CustomChatScreen({ route }: Props): JSX.Element {
  const { chat } = route.params
  const { id } = chat

  const settingsModalRef = useRef<SettingsSelectorModalHandle>(null)
  const settings = fillTCustomChatWithDefaults(id, useCustomChatSettings(id))
  const { chat_name, system_prompt, avatar, font_size } = settings

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()

  const { backgroundChat: backgroundColor } = useThemeScheme()
  const [hideChatAvatar] = useHideChatAvatarPref()

  const { height: keyboardHeight } = useReanimatedKeyboardAnimation()
  const enablekeyboardAvoid = useSharedValue(true)
  const transformStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: enablekeyboardAvoid.value ? keyboardHeight.value : 0 }] }
  }, [])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesInverted = useMemo(() => {
    return [...messages].reverse()
  }, [messages])
  useEffect(() => {
    dbSelectCustomChatMessageOfChatId(id)
      .then(result => {
        setMessages(
          result.rows._array.map(
            v =>
              ({
                role: v.role,
                content: v.content,
              } as any)
          )
        )
      })
      .catch(e => {
        print('dbSelectCustomChatMessageOfChatId', e)
      })
  }, [id])

  const messageListRef = useRef<FlatList<ChatMessage>>(null)
  const scrollToTop = useCallback((delay = 200) => {
    const fn = () => messageListRef.current?.scrollToOffset({ offset: 0, animated: true })
    delay > 0 ? setTimeout(fn, delay) : fn()
  }, [])
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', () => scrollToTop(0))
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
    // print('esRequesting.current = ' + esRequesting.current)
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
    dbInsertCustomMessage({
      ...DEFAULT_T_RESULT_EXTRA,
      chat_id: id,
      role: 'user',
      content: inputText,
      status: null,
    })
      .then(result => {
        print('dbInsertCustomMessage, user = ', result)
      })
      .catch(e => {
        print('dbInsertCustomMessage, user = ', e)
      })

    const messagesToSend: Message[] = []
    if (system_prompt) {
      messagesToSend.push({ role: 'system', content: system_prompt })
    }
    for (const msg of nextMessages) {
      if (msg.role === 'user') {
        messagesToSend.push({ role: 'user', content: msg.content })
      } else if (msg.role === 'assistant') {
        messagesToSend.push({ role: 'assistant', content: msg.content })
      } else {
        // do nothing
      }
    }
    scrollToTop()
    setStatus('sending')
    esRequesting.current = true
    esRef.current?.close()
    esRef.current = sseRequestChatCompletions(urlOptions, customizedOptions, messagesToSend, {
      onNext: content => {
        setContent(content)
        scrollToTop(0)
      },
      onError: (code, message) => {
        setStatus('complete')
        hapticError()
        toast('warning', code, message)
      },
      onDone: message => {
        setMessages(prev => [...prev, { role: 'assistant', content: message.content }])
        dbInsertCustomMessage({
          ...DEFAULT_T_RESULT_EXTRA,
          chat_id: id,
          role: 'assistant',
          content: message.content,
          status: null,
        })
          .then(result => {
            print('dbInsertCustomMessage, assistant = ', result)
          })
          .catch(e => {
            print('dbInsertCustomMessage, assistant = ', e)
          })

        setStatus('complete')
        setContent('')
        hapticSuccess()
        scrollToTop()
      },
      onComplete: () => {
        esRequesting.current = false
      },
    })
  }

  const handleSavePress = () => {}

  const renderItemSeparator = () => <View style={{ height: dimensions.messageSeparator }} />

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['left', 'right']}>
        <TitleBar
          title={chat_name ?? ''}
          subtitle={system_prompt ?? ''}
          action={{
            iconName: 'tune',
            onPress: () => settingsModalRef.current?.show(),
          }}
        />
        <View style={[{ flex: 1, overflow: 'hidden' }]}>
          <Animated.View style={[{ flex: 1 }, transformStyle]}>
            {/*
             * The FlashList with an inverted orientation has an incorrect location for the vertical scroll indicator on the left side.
             * Therefore, it should be replaced by a FlatList.
             */}
            <FlatList
              ref={messageListRef}
              contentContainerStyle={{ paddingVertical: dimensions.messageSeparator }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              inverted={true}
              data={messagesInverted}
              keyExtractor={(item, index) => `${index}_${item.role}_${item.content}`}
              renderItem={({ item }) => {
                if (item.role === 'divider') {
                  return <AppDividerView message={item} onSavePress={handleSavePress} />
                }
                if (item.role === 'user') {
                  return (
                    <UserMessageView
                      hideChatAvatar={hideChatAvatar}
                      fontSize={font_size}
                      message={item}
                    />
                  )
                }
                if (item.role === 'assistant') {
                  return (
                    <AssistantMessageView
                      avatar={avatar}
                      hideChatAvatar={hideChatAvatar}
                      fontSize={font_size}
                      message={item}
                    />
                  )
                }
                return null
              }}
              ItemSeparatorComponent={renderItemSeparator}
              ListHeaderComponent={
                <SSEMessageView fontSize={font_size} hideChatAvatar={hideChatAvatar} />
              }
              onEndReached={() => console.log('onEndReached')}
            />
          </Animated.View>
        </View>
        <InputBar
          value={inputText}
          sendDisabled={sendDisabled}
          onChangeText={setInputText}
          onSendPress={onSendPress}
          onNewDialoguePress={() => {
            setMessages([...messages, { role: 'divider', content: 'NEW DIALOGUE' }])
          }}
        />
        <SettingsSelectorModal
          ref={settingsModalRef}
          settings={settings}
          onSettingsChange={values => {
            updateCustomChatSettings(id, values)
            dbUpdateCustomChatWhere(id, values)
            hapticSuccess()
          }}
          onDeleteAllMessageConfirm={() => {
            setMessages([])
            dbDeleteCustomChatMessageOfChatId(id)
            hapticSuccess()
          }}
          onShow={() => (enablekeyboardAvoid.value = false)}
          onDismiss={() => (enablekeyboardAvoid.value = true)}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

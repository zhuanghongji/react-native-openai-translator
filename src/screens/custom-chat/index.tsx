import { TitleBar } from '../../components/TitleBar'
import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { AppDividerView } from '../../components/chat/DividerMessageView'
import { InputBar } from '../../components/chat/InputBar'
import { SSEMessageView } from '../../components/chat/SSEMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { useInfinitePageDataLoader } from '../../components/query/infinite-hooks'
import { DEFAULT_T_RESULT_EXTRA, fillTCustomChatWithDefaults } from '../../db/helper'
import { dbUpdateCustomChatWhere } from '../../db/table/t-custom-chat'
import {
  dbDeleteCustomChatMessageOfChatId,
  dbInsertCustomMessage,
  useInfiniteQueryCustomChatMessagePageable,
} from '../../db/table/t-custom-chat-message'
import { hapticError, hapticSuccess, hapticWarning } from '../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { useHideChatAvatarPref } from '../../preferences/storages'
import { print } from '../../printer'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { ChatMessage } from '../../types'
import {
  updateCustomChatSettings,
  useCustomChatSettings,
} from '../../zustand/stores/custom-chat-settings-helper'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import type { RootStackParamList } from '../screens'
import { generateMessagesToSend } from './helper'
import {
  SettingsSelectorModal,
  SettingsSelectorModalHandle,
} from './settings/SettingsSelectorModal'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { chat_name, system_prompt, avatar, font_size, context_messages_num } = settings

  const { t } = useTranslation()

  const [freshMessages, setFreshMessages] = useState<ChatMessage[]>([])
  const legacyPageSize = context_messages_num > 20 ? 100 : 20
  const legacyResult = useInfiniteQueryCustomChatMessagePageable(id, legacyPageSize)
  const { items: legacyMessages, onFetchNextPage: onEndReached } =
    useInfinitePageDataLoader(legacyResult)

  const finalMessages = useMemo<ChatMessage[]>(() => {
    const legacyItems: ChatMessage[] = legacyMessages.map(v => {
      return {
        role: v.role,
        content: v.content,
      } as ChatMessage
    })
    return [...freshMessages, ...legacyItems]
  }, [freshMessages, legacyMessages])

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()

  const { backgroundChat: backgroundColor } = useThemeScheme()
  const [hideChatAvatar] = useHideChatAvatarPref()

  const { height: keyboardHeight } = useReanimatedKeyboardAnimation()
  const enablekeyboardAvoid = useSharedValue(true)
  const transformStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: enablekeyboardAvoid.value ? keyboardHeight.value : 0 }] }
  }, [])

  const messageListRef = useRef<FlatList<ChatMessage>>(null)
  const scrollToTop = useCallback((delay = 200) => {
    const fn = () => messageListRef.current?.scrollToOffset({ offset: 0, animated: true })
    delay > 0 ? setTimeout(fn, delay) : fn()
  }, [])
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', () => scrollToTop(0))
    return () => show.remove()
  }, [freshMessages.length])

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
    const userMessage: ChatMessage = { role: 'user', content: inputText }
    const nextMessages: ChatMessage[] = [userMessage, ...freshMessages]
    setFreshMessages(nextMessages)
    dbInsertCustomMessage({
      ...DEFAULT_T_RESULT_EXTRA,
      chat_id: id,
      role: 'user',
      content: inputText,
      content_supplements: null,
      directive: null,
      status: null,
    })
      .then(result => {
        print('dbInsertCustomMessage, user = ', result)
      })
      .catch(e => {
        print('dbInsertCustomMessage, user = ', e)
      })
    const messages = generateMessagesToSend({
      systemPrompt: system_prompt,
      contextMessagesNum: context_messages_num,
      currentMessages: finalMessages,
      newMessage: userMessage,
    })
    scrollToTop()
    setStatus('sending')
    esRequesting.current = true
    esRef.current?.close()
    esRef.current = sseRequestChatCompletions(urlOptions, customizedOptions, messages, {
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
        const assistantMessage: ChatMessage = { role: 'assistant', content: message.content }
        setFreshMessages(prev => [assistantMessage, ...prev])
        dbInsertCustomMessage({
          ...DEFAULT_T_RESULT_EXTRA,
          chat_id: id,
          role: 'assistant',
          content: message.content,
          content_supplements: null,
          directive: null,
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
          title={chat_name ? chat_name : t('Unnamed')}
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
              data={finalMessages}
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
              onEndReached={() => {
                console.log('onEndReached')
                onEndReached()
              }}
            />
          </Animated.View>
        </View>
        <InputBar
          value={inputText}
          sendDisabled={sendDisabled}
          onChangeText={setInputText}
          onSendPress={onSendPress}
          onNewDialoguePress={() => {
            const dividerMessage: ChatMessage = { role: 'divider', content: 'NEW DIALOGUE' }
            setFreshMessages([dividerMessage, ...freshMessages])
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
          onDeleteAllMessageConfirm={async () => {
            try {
              await dbDeleteCustomChatMessageOfChatId(id)
              legacyResult.refetch()
              setFreshMessages([])
              hapticSuccess()
            } catch (e) {
              hapticWarning()
            }
          }}
          onShow={() => (enablekeyboardAvoid.value = false)}
          onDismiss={() => (enablekeyboardAvoid.value = true)}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

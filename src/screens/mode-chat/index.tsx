import { ConfirmModal } from '../../components/ConfirmModal'
import { SvgIconName } from '../../components/SvgIcon'
import { TitleBar } from '../../components/TitleBar'
import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { AppDividerView } from '../../components/chat/DividerMessageView'
import { InputBar } from '../../components/chat/InputBar'
import { SSEMessageView } from '../../components/chat/SSEMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { dbInsertModeChatMessageSimply } from '../../db/helper'
import {
  dbDeleteModeChatMessageOfResultId,
  useQueryModeChatMessageOfResultId,
} from '../../db/table/t-mode-chat-message'
import { hapticError, hapticSuccess, hapticWarning } from '../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../http/apis/v1/chat/completions'
import { DEFAULTS } from '../../preferences/defaults'
import { TranslatorMode } from '../../preferences/options'
import { useShowChatAvatarPref } from '../../preferences/storages'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { BaseMessage, ChatMessage } from '../../types'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import { RootStackParamList } from '../screens'
import { generateModeMessagesToSend } from './helper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Keyboard, View } from 'react-native'
import { KeyboardEvents, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
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

function getAssistantIconName(mode: TranslatorMode): SvgIconName {
  if (mode === 'translate') {
    return 'language'
  }
  if (mode === 'polishing') {
    return 'palette'
  }
  if (mode === 'summarize') {
    return 'summarize'
  }
  if (mode === 'analyze') {
    return 'analytics'
  }
  return 'bubble'
}

export function ModeChatScreen({ navigation, route }: Props): JSX.Element {
  const { modeResult } = route.params
  const { id, mode, system_prompt } = modeResult
  const translatorMode = mode as TranslatorMode
  const title = useTitle(translatorMode)
  const assistantIconName = getAssistantIconName(translatorMode)

  const { t } = useTranslation()
  const [clearMessagesModalVisible, setClearMessagesModalVisible] = useState(false)
  const fontSize = DEFAULTS.fontSize

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()

  const { backgroundChat: backgroundColor } = useThemeScheme()
  const [showChatAvatar] = useShowChatAvatarPref()

  const { height: keyboardHeight } = useReanimatedKeyboardAnimation()
  const transformStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboardHeight.value }] }
  }, [])

  const resultMessages = useMemo<BaseMessage[]>(() => {
    const { user_prompt_prefix, user_prompt_suffix, user_content, assistant_content } = modeResult
    const userContent = `${user_prompt_prefix ?? ''}${user_content}${user_prompt_suffix ?? ''}`
    return [
      {
        role: 'divider',
        content: '0',
      },

      {
        role: 'user',
        content: userContent,
      },
      {
        role: 'assistant',
        content: assistant_content,
      },
    ]
  }, [modeResult])
  const legacyResult = useQueryModeChatMessageOfResultId(id)
  const legacyMessages = legacyResult.data?.rows._array ?? []
  const [freshMessages, setFreshMessages] = useState<BaseMessage[]>([])
  const finalMessages = useMemo<ChatMessage[]>(() => {
    const result: ChatMessage[] = []
    const inContext = null
    for (const { role, content } of resultMessages) {
      if (role === 'divider' || role === 'user' || role === 'assistant') {
        result.push({ role, content, inContext })
      }
    }
    for (const { role, content } of legacyMessages) {
      if (role === 'divider' || role === 'user' || role === 'assistant') {
        result.push({ role, content, inContext })
      }
    }
    for (const { role, content } of freshMessages) {
      if (role === 'divider' || role === 'user' || role === 'assistant') {
        result.push({ role, content, inContext })
      }
    }
    return result.reverse()
  }, [resultMessages, legacyMessages, freshMessages])

  const messageListRef = useRef<FlatList<ChatMessage>>(null)
  const scrollToTop = useCallback((delay = 200) => {
    const fn = () => messageListRef.current?.scrollToOffset({ offset: 0, animated: true })
    delay > 0 ? setTimeout(fn, delay) : fn()
  }, [])
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', () => scrollToTop(0))
    return () => show.remove()
  }, [finalMessages.length])

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
    setFreshMessages(prev => [...prev, { role: 'user', content: inputText }])
    dbInsertModeChatMessageSimply({
      result_id: id,
      role: 'user',
      content: inputText,
    })
    setStatus('sending')
    scrollToTop()

    const messages = generateModeMessagesToSend({
      systemPrompt: system_prompt,
      currentMessages: finalMessages,
      userMessageContent: inputText,
    })
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
        setFreshMessages(prev => [...prev, { role: 'assistant', content: message.content }])
        dbInsertModeChatMessageSimply({
          result_id: id,
          role: 'assistant',
          content: message.content,
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

  const handleSharePress = () => {
    if (finalMessages.length === 0) {
      hapticWarning()
      toast('warning', t('No valid messages'), '')
      return
    }
    const messages = [...finalMessages].reverse().filter(v => v.role !== 'divider')
    navigation.navigate('ShareChat', {
      avatarName: assistantIconName,
      fontSize: fontSize,
      messages,
    })
  }

  const renderItemSeparator = () => <View style={{ height: dimensions.messageSeparator }} />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['left', 'right']}>
      <TitleBar
        title={title}
        subtitle={system_prompt}
        action={
          finalMessages.length > 0
            ? {
                iconName: 'delete',
                onPress: () => {
                  Keyboard.dismiss()
                  setClearMessagesModalVisible(true)
                },
              }
            : undefined
        }
      />
      <View style={[{ flex: 1, overflow: 'hidden' }]}>
        <Animated.View style={[{ flex: 1 }, transformStyle]}>
          {/* 
            The FlashList with an inverted orientation has an incorrect location for the vertical scroll indicator on the left side. 
            Therefore, it should be replaced by a FlatList. 
          */}
          <FlatList
            ref={messageListRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: dimensions.messageSeparator }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            inverted={true}
            data={finalMessages}
            keyExtractor={(item, index) => `${index}_${item.role}_${item.content}`}
            renderItem={({ item, index }) => {
              if (item.role === 'divider') {
                return (
                  <AppDividerView index={index} message={item} onSharePress={handleSharePress} />
                )
              }
              if (item.role === 'user') {
                return (
                  <UserMessageView
                    fontSize={fontSize}
                    message={item}
                    showChatAvatar={showChatAvatar}
                  />
                )
              }
              if (item.role === 'assistant') {
                return (
                  <AssistantMessageView
                    svgIconName={assistantIconName}
                    fontSize={fontSize}
                    message={item}
                    showChatAvatar={showChatAvatar}
                  />
                )
              }
              return null
            }}
            ItemSeparatorComponent={renderItemSeparator}
            ListHeaderComponent={
              <SSEMessageView fontSize={fontSize} showChatAvatar={showChatAvatar} />
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
      />
      <ConfirmModal
        rightTextStyle={{ color: colors.warning }}
        visible={clearMessagesModalVisible}
        message={t('ChatMessageClearWarning')}
        leftText={t('CANCEL')}
        rightText={t('CLEAR')}
        onRightPress={async () => {
          try {
            await dbDeleteModeChatMessageOfResultId(id)
            legacyResult.refetch()
            toast('success', t('Clear messages success'), '')
            setFreshMessages([])
            hapticSuccess()
          } catch (e) {
            hapticWarning()
          }
        }}
        onDismissRequest={setClearMessagesModalVisible}
      />
    </SafeAreaView>
  )
}

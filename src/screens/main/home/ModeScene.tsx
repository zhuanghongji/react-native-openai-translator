import { TTSModal, TTSModalHandle } from '../../../components/TTSModal'
import { hapticError, hapticSoft, hapticSuccess } from '../../../haptic'
import { useOpenAIApiCustomizedOptions, useOpenAIApiUrlOptions } from '../../../http/apis/hooks'
import { sseRequestChatCompletions } from '../../../http/apis/v1/chat/completions'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { dimensions } from '../../../res/dimensions'
import { toast } from '../../../toast'
import { Message, TranslatorStatus } from '../../../types'
import { RootStackParamList } from '../../screens'
import { ClipboardDetectedModal } from './ClipboardDetectedModal'
import { InputView, InputViewHandle } from './InputView'
import { OutputView, OutputViewHandle } from './OutputView'
import { StatusDivider } from './StatusDivider'
import { ToolButton } from './ToolButton'
import { UnsupportTip } from './UnsupportTip'
import { useMessagesWithPrompts } from './prompts'
import Clipboard from '@react-native-clipboard/clipboard'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type ModeSceneProps = {
  style?: StyleProp<ViewStyle>
  focused: boolean
  targetLang: LanguageKey
  translatorMode: TranslatorMode
}

export type ModeSceneHandle = {
  inputFocus: () => void
  inputText: (value: string) => void
}

export const ModeScene = React.forwardRef<ModeSceneHandle, ModeSceneProps>((props, ref) => {
  const { style, focused, targetLang, translatorMode } = props

  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { urlOptions, checkIsOptionsValid } = useOpenAIApiUrlOptions()
  const customizedOptions = useOpenAIApiCustomizedOptions()
  const [status, setStatus] = useState<TranslatorStatus>('none')

  const inputViewRef = useRef<InputViewHandle>(null)
  const [inputText, setInputText] = useState('')
  const {
    messages: messagesToSend,
    prompts,
    userContent,
  } = useMessagesWithPrompts({
    targetLang,
    translatorMode,
    inputText,
  })
  const hasUserContent = inputText ? true : false

  const outputViewRef = useRef<OutputViewHandle>(null)
  const [outputText, setOutputText] = useState('')

  const ttsModalRef = useRef<TTSModalHandle>(null)

  // auto focus after clipboard confirmed
  const clipboardConfirmedRef = useRef(false)
  useEffect(() => {
    if (!clipboardConfirmedRef.current) {
      return
    }
    clipboardConfirmedRef.current = false
    const timer = setTimeout(() => inputViewRef.current?.focus(), 300)
    return () => clearTimeout(timer)
  }, [inputText])

  useImperativeHandle(ref, () => ({
    inputFocus: () => inputViewRef.current?.focus(),
    inputText: setInputText,
  }))

  const perfromChatCompletions = (messages: Message[]) => {
    if (!checkIsOptionsValid()) {
      return
    }
    setOutputText('')
    setStatus('pending')
    sseRequestChatCompletions(urlOptions, customizedOptions, messages, {
      onNext: content => {
        outputViewRef.current?.updateText(content)
      },
      onError: (code, message) => {
        setStatus('failure')
        hapticError()
        toast('warning', code, message)
      },
      onDone: message => {
        setOutputText(message.content)
        setStatus('success')
        hapticSuccess()
      },
    })
  }
  return (
    <View style={[styles.container, style]} collapsable={false}>
      <InputView
        ref={inputViewRef}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={() => perfromChatCompletions(messagesToSend)}
      />
      <View style={styles.toolsRow}>
        <ToolButton
          name="compaign"
          disabled={!hasUserContent}
          onPress={() => {
            ttsModalRef.current?.speak({
              content: inputText,
              lang: null,
            })
          }}
        />
        <ToolButton
          name="copy"
          disabled={!hasUserContent}
          onPress={() => {
            hapticSoft()
            Clipboard.setString(inputText)
            toast('success', t('Copied to clipboard'), inputText)
          }}
        />
        <ToolButton
          name="clean"
          disabled={!hasUserContent}
          onPress={() => {
            hapticSoft()
            setStatus('none')
            setInputText('')
            setOutputText('')
            inputViewRef.current?.focus()
          }}
        />
      </View>

      <StatusDivider mode={translatorMode} status={status} />
      <ScrollView
        style={{ flex: 1, marginTop: dimensions.edge }}
        contentContainerStyle={{ paddingBottom: dimensions.spaceBottom }}>
        <OutputView ref={outputViewRef} text={outputText} />
        <View style={styles.toolsRow}>
          {outputText ? (
            <>
              <ToolButton
                name="compaign"
                onPress={() => {
                  ttsModalRef.current?.speak({
                    content: outputText,
                    lang: targetLang,
                  })
                }}
              />
              <ToolButton
                name="copy"
                onPress={() => {
                  hapticSoft()
                  Clipboard.setString(outputText)
                  toast('success', t('Copied to clipboard'), outputText)
                }}
              />
            </>
          ) : null}
          <ToolButton
            name="chat"
            onPress={() => {
              const { systemPrompt } = prompts
              navigation.push('ModeChat', {
                translatorMode,
                systemPrompt,
                userContent,
                assistantContent: outputText,
              })
            }}
          />
        </View>
        <UnsupportTip />
      </ScrollView>

      <ClipboardDetectedModal
        enabled={focused}
        inputText={inputText}
        outputText={outputText}
        onConfirmPress={text => {
          clipboardConfirmedRef.current = true
          setInputText(text)
        }}
      />
      <TTSModal ref={ttsModalRef} />
    </View>
  )
})

type Styles = {
  container: ViewStyle
  toolsRow: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: '100%',
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 32,
    marginTop: dimensions.edge,
    paddingRight: dimensions.edge,
  },
})

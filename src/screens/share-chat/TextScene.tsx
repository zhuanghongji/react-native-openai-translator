import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { ChatMessage } from '../../types'
import { ShareButton } from './ShareButton'
import Clipboard from '@react-native-clipboard/clipboard'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

export type TextSceneProps = {
  fontSize: number
  messages: ChatMessage[]
}

export function TextScene(props: TextSceneProps): JSX.Element {
  const { fontSize, messages } = props

  const { t } = useTranslation()
  const { backgroundChat } = useThemeScheme()

  const text = useMemo(() => {
    const contents: string[] = []
    let isPreAssistant = false
    for (const item of messages) {
      if (isPreAssistant && item.role === 'user') {
        contents.push('\n')
      }
      isPreAssistant = item.role === 'assistant'
      // contents.push(`${item.role === 'assistant' ? '✨' : avatar} ${item.content}\n`)
      contents.push(`${item.role === 'assistant' ? '●' : '○'} ${item.content}\n`)
    }
    return contents.join('')
  }, [messages])

  return (
    <View style={stylez.f1}>
      <ScrollView
        style={stylez.f1}
        contentContainerStyle={{
          paddingTop: dimensions.messageSeparator,
          backgroundColor: backgroundChat,
        }}>
        <TText
          style={{
            paddingHorizontal: dimensions.edge,
            fontSize: fontSize,
            lineHeight: fontSize * 1.5,
          }}
          typo="text">
          {text}
        </TText>
      </ScrollView>
      <ShareButton
        text={t('Copy to Clipboard')}
        onPress={() => {
          Clipboard.setString(text)
          toast('success', t('Copied to clipboard'), text)
        }}
      />
    </View>
  )
}

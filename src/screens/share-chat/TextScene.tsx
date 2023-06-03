import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { texts } from '../../res/texts'
import { TText } from '../../themes/TText'
import { useThemeSelector } from '../../themes/hooks'
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
  const backgroundColor = useThemeSelector(colors.c18, colors.cED)

  const text = useMemo(() => {
    const contents: string[] = []
    let isPreAssistant = false
    for (const item of messages) {
      if (isPreAssistant && item.role === 'user') {
        contents.push('\n-----\n\n')
      }
      isPreAssistant = item.role === 'assistant'
      const cursor = item.role === 'assistant' ? `\n${texts.assistantCursor}` : texts.userCursor
      contents.push(`${cursor} ${item.content}\n`)
    }
    return contents.join('')
  }, [messages])

  return (
    <View style={stylez.f1}>
      <ScrollView
        style={stylez.f1}
        contentContainerStyle={{
          paddingTop: dimensions.messageSeparator,
          backgroundColor,
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

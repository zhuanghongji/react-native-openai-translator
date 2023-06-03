import { dimensions } from '../../res/dimensions'
import { images } from '../../res/images'
import { stylez } from '../../res/stylez'
import { texts } from '../../res/texts'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import { trimContent } from '../../utils'
import { useSSEMessageStore } from '../../zustand/stores/sse-message-store'
import { AnimRotateContainer } from '../AnimRotateContainer'
import React from 'react'
import { Image, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type SSEMessageProps = {
  style?: StyleProp<ViewStyle>
  fontSize: number
  showChatAvatar: boolean
}

export function SSEMessageView(props: SSEMessageProps) {
  const { style, fontSize, showChatAvatar } = props

  const { backgroundMessage: backgroundColor } = useThemeScheme()

  const status = useSSEMessageStore(state => state.status)
  const content = useSSEMessageStore(state => state.content)
  if (status !== 'sending') {
    return null
  }
  return (
    <View style={[style, styles.container]}>
      {showChatAvatar ? (
        <AnimRotateContainer style={stylez.chatAvatarContainer} rotating={true}>
          <Image style={stylez.chatAvatarLogo} source={images.logoMini} />
        </AnimRotateContainer>
      ) : (
        <View style={stylez.chatAvatarContainerHidden} />
      )}

      <View style={[styles.content, { backgroundColor }]}>
        <TText
          style={[styles.text, stylez.contentText, { fontSize, lineHeight: fontSize * 1.2 }]}
          typo="text">
          {`${trimContent(content)}${texts.assistantCursor}`}
        </TText>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  content: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    marginTop: dimensions.messageSeparator,
  },
  content: {
    maxWidth: '80%',
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
  },
  text: {
    textAlign: 'justify',
    textAlignVertical: 'top',
  },
})

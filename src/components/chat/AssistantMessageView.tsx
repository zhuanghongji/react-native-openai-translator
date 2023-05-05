import { dimensions } from '../../res/dimensions'
import { images } from '../../res/images'
import { sheets } from '../../res/sheets'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import { ChatMessage } from '../../types'
import { trimContent } from '../../utils'
import React from 'react'
import { Image, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type AssistantMessageProps = {
  style?: StyleProp<ViewStyle>
  message: ChatMessage
  hideChatAvatar: boolean
}

export function AssistantMessageView(props: AssistantMessageProps) {
  const { style, message, hideChatAvatar } = props
  const { content } = message

  const { backgroundMessage: backgroundColor } = useThemeScheme()

  return (
    <View style={[style, styles.container]}>
      {hideChatAvatar ? (
        <View style={{ width: 5 }} />
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image style={{ width: 18, height: 18, marginTop: 12 }} source={images.logoMini} />
        </View>
      )}

      <View style={[styles.content, { backgroundColor }]}>
        <TText style={[styles.text, sheets.contentText]} typo="text">
          {trimContent(content)}
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
    paddingLeft: dimensions.edge,
  },
  content: {
    maxWidth: '80%',
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
  },
  text: {
    textAlign: 'justify',
  },
})

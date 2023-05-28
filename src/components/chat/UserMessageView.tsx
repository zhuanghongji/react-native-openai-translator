import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { TText } from '../../themes/TText'
import { ChatMessage } from '../../types'
import { trimContent } from '../../utils'
import { SvgIcon } from '../SvgIcon'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type UserMessageProps = {
  style?: StyleProp<ViewStyle>
  fontSize: number
  message: ChatMessage
  hideChatAvatar: boolean
}

export function UserMessageView(props: UserMessageProps) {
  const { style, fontSize, message, hideChatAvatar } = props
  const { content, inContext } = message

  let borderColor = colors.transparent
  if (inContext === true) {
    borderColor = colors.in
  } else if (inContext === false) {
    borderColor = colors.out
  }

  return (
    <View style={[style, styles.container]}>
      <View style={[styles.content, { borderColor }]}>
        <TText
          style={[styles.text, stylez.contentText, { fontSize, lineHeight: fontSize * 1.2 }]}
          selectable={true}
          typo="text">
          {trimContent(content)}
        </TText>
      </View>
      {hideChatAvatar ? (
        <View style={stylez.chatAvatarContainerHidden} />
      ) : (
        <View style={stylez.chatAvatarContainer}>
          <SvgIcon size={dimensions.chatAvatar} color={colors.primary} name="account" />
        </View>
      )}
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
    justifyContent: 'flex-end',
  },
  content: {
    maxWidth: '80%',
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.primary,
  },
  text: {
    textAlign: 'justify',
    color: 'black',
  },
})

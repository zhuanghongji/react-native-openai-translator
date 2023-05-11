import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { ChatMessage } from '../../types'
import { trimContent } from '../../utils'
import { SvgIcon } from '../SvgIcon'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type UserMessageProps = {
  style?: StyleProp<ViewStyle>
  message: ChatMessage
  hideChatAvatar: boolean
}

export function UserMessageView(props: UserMessageProps) {
  const { style, message, hideChatAvatar } = props
  const { content } = message

  return (
    <View style={[style, styles.container]}>
      <View style={styles.content}>
        <Text style={[styles.text, stylez.contentText]}>{trimContent(content)}</Text>
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
    backgroundColor: colors.primary,
  },
  text: {
    textAlign: 'justify',
    color: 'black',
  },
})

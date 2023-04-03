import { SvgIcon } from '../../../components/SvgIcon'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { sheets } from '../../../res/sheets'
import { ChatMessage } from '../../../types'
import { trimContent } from '../../../utils'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type UserMessageProps = {
  style?: StyleProp<ViewStyle>
  message: ChatMessage
}

export function UserMessageView(props: UserMessageProps) {
  const { style, message } = props
  const { content } = message

  return (
    <View style={[style, styles.container]}>
      <View style={styles.content}>
        <Text style={[styles.text, sheets.contentText]}>
          {trimContent(content)}
        </Text>
      </View>
      <View
        style={{
          width: 32,
          paddingTop: 12,
          alignItems: 'center',
        }}>
        <SvgIcon size={23} color={colors.primary} name="account" />
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
    justifyContent: 'flex-end',
    paddingRight: dimensions.edge,
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

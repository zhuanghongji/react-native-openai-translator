import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { images } from '../../res/images'
import { stylez } from '../../res/stylez'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import { ChatMessage } from '../../types'
import { trimContent } from '../../utils'
import { SvgIcon, SvgIconName } from '../SvgIcon'
import React, { useState } from 'react'
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type AssistantMessageProps = {
  style?: StyleProp<ViewStyle>
  avatar?: string | null
  svgIconName?: SvgIconName
  fontSize: number
  message: ChatMessage
  hideChatAvatar: boolean
}

export function AssistantMessageView(props: AssistantMessageProps) {
  const { style, avatar, svgIconName, fontSize, message, hideChatAvatar } = props
  const { content, inContext } = message

  let borderColor = colors.transparent
  if (inContext === true) {
    borderColor = colors.in
  } else if (inContext === false) {
    borderColor = colors.out
  }

  const { tint, tint2, backgroundMessage: backgroundColor } = useThemeScheme()
  const [moreVisible, setMoreVisible] = useState(false)

  const renderAvatar = () => {
    if (hideChatAvatar) {
      return <View style={stylez.chatAvatarContainerHidden} />
    }
    if (avatar) {
      return (
        <View style={stylez.chatAvatarContainer}>
          <Text style={{ fontSize: 18, color: colors.black, includeFontPadding: false }}>
            {avatar}
          </Text>
        </View>
      )
    }
    if (svgIconName) {
      return (
        <View style={stylez.chatAvatarContainer}>
          <SvgIcon size={22} name={svgIconName} color={tint} />
        </View>
      )
    }
    return (
      <View style={stylez.chatAvatarContainer}>
        <Image style={stylez.chatAvatarLogo} source={images.logoMini} />
      </View>
    )
  }

  return (
    <View style={[style, styles.container]}>
      {renderAvatar()}
      <View style={[styles.content, { backgroundColor, borderColor }]}>
        <TText
          style={[styles.text, stylez.contentText, { fontSize, lineHeight: fontSize * 1.2 }]}
          selectable={true}
          typo="text">
          {trimContent(content)}
        </TText>
      </View>
      <View style={stylez.f1}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingLeft: 6,
            paddingBottom: 2,
          }}
          // TODO show more menu
          disabled={true}
          onPressIn={() => setMoreVisible(true)}
          onPressOut={() => setMoreVisible(false)}
          onLongPress={() => {
            // TODO show more menu
          }}>
          {moreVisible ? <SvgIcon size={14} color={tint2} name="more" /> : null}
        </Pressable>
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
  },
  content: {
    maxWidth: '80%',
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    textAlign: 'justify',
  },
})

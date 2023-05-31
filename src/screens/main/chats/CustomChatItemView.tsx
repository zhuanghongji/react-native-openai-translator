import { Divider } from '../../../components/Divider'
import { EmojiAvatar } from '../../../components/EmojiAvatar'
import { TCustomChat } from '../../../db/types'
import { DEFAULTS } from '../../../preferences/defaults'
import { dimensions } from '../../../res/dimensions'
import { TText } from '../../../themes/TText'
import { useCustomChatSettings } from '../../../zustand/stores/custom-chat-settings-helper'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

const AVATAR_SIZE = 48

export type CustomChatItemViewProps = {
  style?: StyleProp<ViewStyle>
  bgColor: string
  bgColorPinned: string
  item: TCustomChat
  onPress: (chat: TCustomChat) => void
}

export function CustomChatItemView(props: CustomChatItemViewProps) {
  const { style, bgColor, bgColorPinned, item, onPress } = props
  const { id, latest_message_content, latest_message_time, pinned } = item

  const settings = useCustomChatSettings(id)

  const avatar = settings?.avatar ?? DEFAULTS.avatar
  const name = settings?.chat_name ? settings.chat_name : 'Unnamed'

  const system_prompt = settings?.system_prompt ? settings.system_prompt : ''
  const content = latest_message_content ? latest_message_content : system_prompt
  const subtitle = !content || content === '1' ? '-' : content

  const time = useMemo(() => {
    if (!latest_message_time) {
      return ''
    }
    return dayjs(latest_message_time).format('MM-DD HH:mm')
  }, [latest_message_time])

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: pinned === '1' ? bgColorPinned : bgColor },
        style,
      ]}
      onPress={() => onPress(item)}>
      <View style={styles.row}>
        <EmojiAvatar containerSize={AVATAR_SIZE} disabled={true} value={avatar} />
        <View style={styles.content}>
          <View style={{ flexDirection: 'row' }}>
            <TText style={styles.title} typo="text" numberOfLines={1}>
              {name}
            </TText>
            <TText style={styles.time} typo="text3" numberOfLines={1}>
              {time}
            </TText>
          </View>
          <TText style={styles.subtitle} typo="text3" numberOfLines={1}>
            {subtitle.replace(/\n/g, ' ')}
          </TText>
        </View>
      </View>
      <Divider wing={dimensions.edgeTwice + AVATAR_SIZE} />
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  row: ViewStyle
  content: ViewStyle
  title: TextStyle
  subtitle: TextStyle
  time: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: dimensions.itemHeight,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: dimensions.edge,
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingLeft: dimensions.edge,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    marginTop: 2,
    marginLeft: dimensions.edge,
  },
})

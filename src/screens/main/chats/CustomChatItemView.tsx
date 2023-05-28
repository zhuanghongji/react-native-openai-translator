import { EmojiAvatar } from '../../../components/EmojiAvatar'
import { TCustomChat } from '../../../db/types'
import { DEFAULTS } from '../../../preferences/defaults'
import { dimensions } from '../../../res/dimensions'
import { TText } from '../../../themes/TText'
import { useCustomChatSettings } from '../../../zustand/stores/custom-chat-settings-helper'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type CustomChatItemViewProps = {
  style?: StyleProp<ViewStyle>
  item: TCustomChat
  onPress: (chat: TCustomChat) => void
}

export function CustomChatItemView(props: CustomChatItemViewProps) {
  const { style, item, onPress } = props
  const { id, latest_message_content, latest_message_time } = item

  const settings = useCustomChatSettings(id)

  const avatar = settings?.avatar ?? DEFAULTS.avatar
  const name = settings?.chat_name ? settings.chat_name : 'Unnamed'

  const system_prompt = settings?.system_prompt ? settings.system_prompt : ''
  const subtitle = latest_message_content ? latest_message_content : system_prompt

  const time = useMemo(() => {
    if (!latest_message_time) {
      return ''
    }
    // return dayjs().calendar(dayjs(latest_message_time))
    return dayjs(latest_message_time).format('MM-DD HH:mm')
  }, [latest_message_time])

  return (
    <Pressable style={[styles.container, style]} onPress={() => onPress(item)}>
      <EmojiAvatar disabled={true} value={avatar} />
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
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  content: ViewStyle
  title: TextStyle
  subtitle: TextStyle
  time: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: dimensions.itemHeight,
    alignItems: 'center',
    paddingHorizontal: dimensions.edge,
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: dimensions.edge,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  time: {
    fontSize: 11,
    marginTop: 2,
  },
})

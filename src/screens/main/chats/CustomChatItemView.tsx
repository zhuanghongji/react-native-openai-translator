import { TCustomChat } from '../../../db/table/t-custom-chat'
import { dimensions } from '../../../res/dimensions'
import { TText } from '../../../themes/TText'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'

export type CustomChatItemViewProps = {
  style?: StyleProp<ViewStyle>
  item: TCustomChat
  onPress: (chat: TCustomChat) => void
}

export function CustomChatItemView(props: CustomChatItemViewProps) {
  const { style, item, onPress } = props
  const { title, system_prompt } = item

  return (
    <Pressable style={[styles.container, style]} onPress={() => onPress(item)}>
      <TText style={styles.title} typo="text" numberOfLines={1}>
        {title}
      </TText>
      <TText style={styles.subtitle} typo="text3" numberOfLines={1}>
        {system_prompt.replace(/\n/g, ' ')}
      </TText>
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  title: TextStyle
  subtitle: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: dimensions.edge,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
})

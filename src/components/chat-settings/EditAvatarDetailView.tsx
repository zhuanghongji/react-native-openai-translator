import { T_CUSTOM_CHAT_BASIC_DEFAULT } from '../../db/table/t-custom-chat'
import { dimensions } from '../../res/dimensions'
import { Divider } from '../Divider'
import { EmojiAvatar } from '../EmojiAvatar'
import { EmojisTabView } from '../EmojisTabView'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditAvatarDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string | null
  onValueChange: (value: string) => void
}

export function EditAvatarDetailView(props: EditAvatarDetailViewProps) {
  const { style, value, onValueChange } = props

  const [avatar, setAvatar] = useState(value ?? T_CUSTOM_CHAT_BASIC_DEFAULT.avatar)
  const actionDisabled = avatar === value

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Avatar"
        actionDisabled={actionDisabled}
        onActionPress={() => onValueChange(avatar)}
      />
      <View style={styles.avatarContainer}>
        <EmojiAvatar value={avatar} />
      </View>
      <Divider style={{ marginBottom: dimensions.edgeTwice }} />
      <EmojisTabView onEmojiPress={setAvatar} />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  avatarContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  avatarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: dimensions.edgeTwice,
  },
})

import { dimensions } from '../../res/dimensions'
import { Divider } from '../Divider'
import { EmojiAvatar } from '../EmojiAvatar'
import { EmojisTabView } from '../EmojisTabView'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditAvatarDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string
  onValueChange: (value: string) => void
  onBackNotify: () => void
}

export function EditAvatarDetailView(props: EditAvatarDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const [avatar, setAvatar] = useState(value)
  const actionDisabled = avatar === value

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title="Edit Avatar"
        actionDisabled={actionDisabled}
        onBackNotify={onBackNotify}
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

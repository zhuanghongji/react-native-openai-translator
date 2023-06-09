import { Divider } from '../../../components/Divider'
import { EmojiAvatar } from '../../../components/EmojiAvatar'
import { EmojisTabView } from '../../../components/EmojisTabView'
import { dimensions } from '../../../res/dimensions'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type EditAvatarDetailViewProps = {
  style?: StyleProp<ViewStyle>
  value: string
  onValueChange: (value: string) => void
  onBackNotify: () => void
}

export function EditAvatarDetailView(props: EditAvatarDetailViewProps) {
  const { style, value, onValueChange, onBackNotify } = props

  const { t } = useTranslation()

  const [avatar, setAvatar] = useState(value)
  const actionDisabled = avatar === value

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        title={t('Avatar')}
        actionDisabled={actionDisabled}
        onBackNotify={onBackNotify}
        onActionPress={() => onValueChange(avatar)}
      />
      <View style={styles.avatarContainer}>
        <EmojiAvatar value={avatar} />
      </View>
      <Divider style={{ marginTop: dimensions.edge }} />
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

import { colors } from '../../res/colors'
import { TText } from '../../themes/TText'
import { SettingsTitleBar } from './SettingsTitleBar'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type DeleteAllMessagesDetailViewProps = {
  style?: StyleProp<ViewStyle>
  onConfirmPress: () => void
}

export function DeleteAllMessagesDetailView(props: DeleteAllMessagesDetailViewProps) {
  const { style, onConfirmPress } = props
  const text = 'Deleting all messages is irreversible.\nAre you sure you want to delete them?'

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar title="Delete All Messages" onActionPress={onConfirmPress} />
      <View style={styles.content}>
        <TText style={styles.text} typo="text">
          {text}
        </TText>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  content: ViewStyle
  text: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.warning,
    fontSize: 17,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

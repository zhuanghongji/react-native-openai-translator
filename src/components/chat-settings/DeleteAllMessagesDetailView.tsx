import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { SettingsTitleBar } from './SettingsTitleBar'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type DeleteAllMessagesDetailViewProps = {
  style?: StyleProp<ViewStyle>
  onConfirmPress: () => void
  onBackNotify: () => void
}

export function DeleteAllMessagesDetailView(props: DeleteAllMessagesDetailViewProps) {
  const { style, onConfirmPress, onBackNotify } = props
  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        actionStyle={{ backgroundColor: colors.warning }}
        actionText={t('CLEAR')}
        title="Delete All Messages"
        onBackNotify={onBackNotify}
        onActionPress={onConfirmPress}
      />
      <View style={styles.content}>
        <TText style={styles.text} typo="text">
          {t('ChatMessageClearWarning')}
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
    alignItems: 'center',
    paddingTop: dimensions.edge * 6,
    paddingHorizontal: dimensions.edgeTriple,
  },
  text: {
    color: colors.warning,
    fontSize: 17,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

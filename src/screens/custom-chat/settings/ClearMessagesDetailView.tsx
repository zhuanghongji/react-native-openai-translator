import { ShakeContainer, ShakeContainerHandle } from '../../../components/ShakeContainer'
import { hapticWarning } from '../../../haptic'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { TText } from '../../../themes/TText'
import { SettingsTitleBar } from './SettingsTitleBar'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type ClearMessagesDetailViewProps = {
  style?: StyleProp<ViewStyle>
  onConfirmPress: () => void
  onBackNotify: () => void
}

export function ClearMessagesDetailView(props: ClearMessagesDetailViewProps) {
  const { style, onConfirmPress, onBackNotify } = props
  const { t } = useTranslation()

  const shakeContainerRef = useRef<ShakeContainerHandle>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      hapticWarning()
      shakeContainerRef.current?.shake()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        actionStyle={{ backgroundColor: colors.warning }}
        actionText={t('CLEAR')}
        title={t('Clear Messages')}
        onBackNotify={onBackNotify}
        onActionPress={onConfirmPress}
      />
      <View style={styles.content}>
        <ShakeContainer ref={shakeContainerRef}>
          <TText style={styles.text} typo="text">
            {t('ChatMessageClearWarning')}
          </TText>
        </ShakeContainer>
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

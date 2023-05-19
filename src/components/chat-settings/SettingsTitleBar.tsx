import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import { Button } from '../Button'
import { SvgIcon } from '../SvgIcon'
import { useSettingsSelectorContext } from './SettingsSelectorProvider'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export type SettingsTitleBarProps = {
  style?: StyleProp<ViewStyle>
  title?: string
  backHidden?: boolean
  actionDisabled?: boolean
  actionHidden?: boolean
  onActionPress?: () => void
}

export function SettingsTitleBar(props: SettingsTitleBarProps) {
  const {
    style,
    title,
    backHidden = false,
    actionDisabled = false,
    actionHidden = false,
    onActionPress,
  } = props

  const { t } = useTranslation()
  const { tint: tintColor } = useThemeScheme()

  const { handleBackPress } = useSettingsSelectorContext()

  return (
    <View style={[styles.container, style]}>
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback
          style={styles.back}
          disabled={backHidden}
          onPress={handleBackPress}>
          {backHidden ? null : (
            <SvgIcon size={dimensions.iconMedium} color={tintColor} name="back" />
          )}
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.center}>
        <TText style={styles.title} typo="text">
          {title}
        </TText>
      </View>
      <View style={[styles.wrapper, { justifyContent: 'flex-end', paddingRight: dimensions.edge }]}>
        {actionHidden ? null : (
          <Button
            style={styles.action}
            textStyle={styles.actionText}
            disabled={actionDisabled}
            text={t('CONFIRM')}
            onPress={() => {
              onActionPress?.()
              handleBackPress()
            }}
          />
        )}
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  wrapper: ViewStyle
  back: ViewStyle
  action: ViewStyle
  actionText: TextStyle
  center: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: dimensions.barHeight,
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    width: dimensions.barHeight * 2,
    height: dimensions.barHeight,
    alignItems: 'center',
  },
  back: {
    width: dimensions.barHeight,
    height: dimensions.barHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  action: {
    width: dimensions.barHeight * 1.5,
    height: dimensions.barHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

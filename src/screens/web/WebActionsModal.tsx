import { hapticSoft } from '../../haptic'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { WebActionButton } from './WebActionButton'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type WebActionsModalProps = {
  style?: StyleProp<ViewStyle>
  onCopyUrlPress: () => void
  onRefreshPress: () => void
  onOpenInBrowserPress: () => void
}

export type WebActionsModalHandle = {
  show: () => void
}

export const WebActionsModal = React.forwardRef<WebActionsModalHandle, WebActionsModalProps>(
  (props, ref) => {
    const { style, onCopyUrlPress, onRefreshPress, onOpenInBrowserPress } = props

    const { t } = useTranslation()

    const modalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => [240], [])
    useImperativeHandle(ref, () => ({
      show: () => {
        modalRef.current?.present()
      },
    }))

    const renderBackdrop = useCallback(
      (os: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...os} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    )

    const onBeforePress = () => {
      hapticSoft()
      modalRef.current?.dismiss()
    }

    return (
      <BottomSheetModal
        ref={modalRef}
        index={0}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <BottomSheetScrollView style={[stylez.f1, style]}>
          <View style={styles.buttonsRow}>
            <WebActionButton
              iconName="http"
              text={t('Copy Url')}
              onBeforePress={onBeforePress}
              onPress={onCopyUrlPress}
            />
            <WebActionButton
              iconName="refresh"
              text={t('Refresh')}
              onBeforePress={onBeforePress}
              onPress={onRefreshPress}
            />
            <WebActionButton
              iconName="in-browser"
              text={t('Open in default Browser')}
              onBeforePress={onBeforePress}
              onPress={onOpenInBrowserPress}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }
)

type Styles = {
  buttonsRow: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: dimensions.edge,
    alignItems: 'flex-start',
    gap: 4,
  },
})

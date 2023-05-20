import { SvgIcon } from '../../components/SvgIcon'
import { ToolButton } from '../../components/ToolButton'
import { TModeResult } from '../../db/types'
import { hapticSoft } from '../../haptic'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export type ModeResultDetailModalProps = {
  style?: StyleProp<ViewStyle>
  onToChatPress: (item: TModeResult) => void
}

export type ModeResultDetailModalHandle = {
  show: (item: TModeResult) => void
}

export const ModeResultDetailModal = React.forwardRef<
  ModeResultDetailModalHandle,
  ModeResultDetailModalProps
>((props, ref) => {
  const { style, onToChatPress } = props

  const [currentItem, setCurrentItem] = useState<TModeResult | null>(null)

  const { t } = useTranslation()
  const { text: textColor, text2: text2Color, backgroundChat: backgroundColor } = useThemeScheme()
  const { width: frameWidth } = useSafeAreaFrame()
  const contentWidth = frameWidth - dimensions.edgeTwice

  const textStyle = [styles.text, { color: textColor, backgroundColor }]

  const modalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['70%'], [])
  useImperativeHandle(ref, () => ({
    show: (item: TModeResult) => {
      setCurrentItem(item)
      modalRef.current?.present()
    },
  }))

  const renderBackdrop = useCallback(
    (os: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...os} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  )

  const renderHeader = (title: string, target: string) => {
    return (
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: text2Color }]}>{title}</Text>
        <ToolButton
          name="copy"
          onPress={() => {
            hapticSoft()
            Clipboard.setString(target)
            toast('success', t('Copied to clipboard'), target)
          }}
        />
      </View>
    )
  }

  const renderContent = () => {
    if (!currentItem) {
      return null
    }
    const { user_content, assistant_content } = currentItem
    return (
      <>
        <BottomSheetScrollView style={{ flex: 1 }}>
          <View style={{ width: contentWidth, marginLeft: dimensions.edge }}>
            {renderHeader('Input', user_content)}
            <Text style={textStyle}>{user_content}</Text>
            {renderHeader('Output', assistant_content)}
            <Text style={textStyle}>{assistant_content}</Text>
          </View>
        </BottomSheetScrollView>
        <View style={styles.actionContainer}>
          <Pressable
            style={styles.actionTouchable}
            hitSlop={dimensions.hitSlop}
            onPress={() => {
              modalRef.current?.dismiss()
              onToChatPress(currentItem)
            }}>
            <SvgIcon size={dimensions.iconMedium} color={colors.white} name="chat" />
          </Pressable>
        </View>
      </>
    )
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      stackBehavior="push"
      backdropComponent={renderBackdrop}>
      <View style={[styles.container, style]}>{renderContent()}</View>
    </BottomSheetModal>
  )
})

type Styles = {
  container: ViewStyle
  headerRow: ViewStyle
  headerTitle: TextStyle
  text: TextStyle
  actionContainer: ViewStyle
  actionTouchable: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dimensions.edge,
  },
  headerTitle: {
    flex: 1,
    fontSize: 13,
    marginLeft: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    marginBottom: dimensions.edge,
  },
  actionContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: dimensions.edge,
    marginTop: dimensions.edge,
    marginBottom: 32,
  },
  actionTouchable: {
    height: 48,
    paddingHorizontal: dimensions.edge,
    backgroundColor: colors.black,
    justifyContent: 'center',
    borderRadius: dimensions.borderRadius,
  },
})

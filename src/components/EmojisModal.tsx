import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { stylez } from '../res/stylez'
import { useThemeScheme } from '../themes/hooks'
import { EmojisTabView } from './EmojisTabView'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

export type EmojisModalProps = {
  style?: StyleProp<ViewStyle>
  snapHeight: string | number
  animatedIndex?: SharedValue<number>
  animatedPosition?: SharedValue<number>
  onEmojiPress: (value: string) => void
}

export type EmojisModalHandle = {
  show: () => void
}

export const EmojisModal = React.forwardRef<EmojisModalHandle, EmojisModalProps>((props, ref) => {
  const { style, snapHeight, animatedIndex, animatedPosition, onEmojiPress } = props

  const { backgroundIndicator, backgroundModal: backgroundColor } = useThemeScheme()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [snapHeight], [snapHeight])

  useImperativeHandle(ref, () => ({
    show: () => bottomSheetRef.current?.present(),
  }))

  const renderBackdrop = useCallback(
    (_props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {..._props}
        style={[_props.style, { backgroundColor: colors.transparent }]}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      style={[stylez.modal, style]}
      handleIndicatorStyle={{ backgroundColor: backgroundIndicator }}
      backgroundStyle={{ backgroundColor }}
      index={0}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      snapPoints={snapPoints}
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      handleStyle={{
        backgroundColor,
        borderTopLeftRadius: dimensions.borderRadius,
        borderTopRightRadius: dimensions.borderRadius,
      }}
      backdropComponent={renderBackdrop}>
      <View style={stylez.f1}>
        <EmojisTabView onEmojiPress={onEmojiPress} />
      </View>
    </BottomSheetModal>
  )
})

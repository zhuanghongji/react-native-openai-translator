import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeDark } from '../themes/hooks'
import { EmojisTabView } from './EmojisTabView'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

const NUM_COLUMNS = 8

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

  const isDark = useThemeDark()
  const backgroundColor = isDark ? colors.c29 : colors.white

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
      style={style}
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
      <EmojisTabView onEmojiPress={onEmojiPress} />
    </BottomSheetModal>
  )
})

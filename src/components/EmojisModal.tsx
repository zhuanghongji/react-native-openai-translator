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
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
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
      style={[styles.container, style]}
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
      <View style={styles.content}>
        <EmojisTabView onEmojiPress={onEmojiPress} />
      </View>
    </BottomSheetModal>
  )
})

type Styles = {
  container: ViewStyle
  content: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    borderTopLeftRadius: dimensions.modalRadius,
    borderTopRightRadius: dimensions.modalRadius,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
})

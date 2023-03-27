import { dimensions } from '../res/dimensions'
import { PickModalItemView } from './PickModalItemView'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { StyleProp, StyleSheet, ViewStyle, useColorScheme } from 'react-native'
import Animated from 'react-native-reanimated'

export type PickModalProps<T> = {
  style?: StyleProp<ViewStyle>
  value: T
  values: T[] | readonly unknown[]
  animatedIndex?: Animated.SharedValue<number>
  valueToLabel?: (value: T) => string
  onValueChange: (value: T) => void
}

export type PickModalHandle = {
  show: () => void
}

const ITEM_HEIGHT = 48
const ITEM_MAX_VISIBLE_COUNT = 8

function _valueToLabel<T>(value: T) {
  return `${value}`
}

function _PickModal<T>(
  props: PickModalProps<T>,
  ref: React.ForwardedRef<PickModalHandle>
) {
  const {
    style,
    value,
    values,
    animatedIndex,
    valueToLabel = _valueToLabel,
    onValueChange,
  } = props

  const isDark = useColorScheme() === 'dark'
  const backgroundColor = isDark ? '#292929' : '#FFFFFF'

  const bottomSheetRef = useRef<BottomSheet>(null)
  useImperativeHandle(
    ref,
    () => ({
      show: () => bottomSheetRef.current?.snapToIndex(0),
    }),
    []
  )

  const snapPoints = useMemo(
    () => [Math.min(values.length, ITEM_MAX_VISIBLE_COUNT) * ITEM_HEIGHT + 24],
    [values]
  )

  const renderBackdrop = useCallback(
    (_props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {..._props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  return (
    <BottomSheet
      ref={bottomSheetRef}
      style={style}
      index={-1}
      enablePanDownToClose={true}
      snapPoints={snapPoints}
      animatedIndex={animatedIndex}
      handleStyle={{
        backgroundColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
      backdropComponent={renderBackdrop}>
      <BottomSheetFlatList
        style={{ backgroundColor }}
        data={values as T[]}
        keyExtractor={(item, index) => `${index}_${item}`}
        renderItem={({ item }) => {
          const isSelected = item === value
          return (
            <PickModalItemView
              style={styles.item}
              label={valueToLabel(item)}
              isSelected={isSelected}
              onPress={() => {
                onValueChange(item)
                setTimeout(() => {
                  bottomSheetRef.current?.close()
                }, 600)
              }}
            />
          )
        }}
      />
    </BottomSheet>
  )
}

export const PickModal = React.forwardRef(_PickModal) as <T>(
  props: PickModalProps<T> & { ref?: React.ForwardedRef<PickModalHandle> }
) => ReturnType<typeof _PickModal>

type Styles = {
  item: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  item: {
    width: '100%',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: dimensions.edge,
  },
})

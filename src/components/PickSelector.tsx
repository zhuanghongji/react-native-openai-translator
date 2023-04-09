import { colors } from '../res/colors'
import { useThemeDark } from '../themes/hooks'
import { PickSelectorItemView } from './PickSelectorItemView'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Modal from 'react-native-modal'
import Animated, {
  Easing,
  Extrapolation,
  WithTimingConfig,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'

type CGSize = {
  x: number
  y: number
  width: number
  height: number
}

const ITEM_HEIGHT = 48
const ITEM_MAX_VISIBLE_COUNT = 8
const WITH_TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
  easing: Easing.inOut(Easing.ease),
}

function _valueToLabel<T>(value: T) {
  return `${value}`
}

export type PickSelectorProps<T> = {
  style?: StyleProp<ViewStyle>
  selectorStyle?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  value: T
  values: T[] | readonly unknown[]
  offsetY?: number
  disabled?: boolean
  valueToLabel?: (value: T) => string
  onValueChange: (value: T) => void
  renderContent: (options: {
    value: T
    label: string
    anim: Animated.SharedValue<number>
  }) => React.ReactNode
  onDismiss?: (options: { wasKeyboardVisibleWhenShowing: boolean }) => void
}

export function PickSelector<T>(props: PickSelectorProps<T>) {
  const {
    style,
    selectorStyle,
    itemStyle,
    labelStyle,
    value,
    values,
    offsetY = 0,
    disabled = false,
    valueToLabel = _valueToLabel,
    onValueChange,
    renderContent,
    onDismiss,
  } = props

  const isDark = useThemeDark()
  const selectorBackgroundColor = isDark ? colors.c29 : colors.cF7

  const wasKeyboardVisibleWhenShowingRef = useRef(false)
  const isKeyboardVisibleRef = useRef(false)
  useEffect(() => {
    // Instead of `Keyborad.isVisible()` which found not work on iOS
    const subscrition1 = Keyboard.addListener('keyboardDidShow', () => {
      isKeyboardVisibleRef.current = true
    })
    const subscrition2 = Keyboard.addListener('keyboardDidHide', () => {
      isKeyboardVisibleRef.current = false
    })
    return () => {
      subscrition1.remove()
      subscrition2.remove()
    }
  }, [])

  const containerRef = useRef<View>(null)
  const [isVisible, setVisible] = useState(false)

  const initialScrollIndex = Math.max(
    0,
    values.findIndex(v => v === value)
  )
  const contentHeight = Math.min(values.length, ITEM_MAX_VISIBLE_COUNT) * ITEM_HEIGHT

  const { top: topInset } = useSafeAreaInsets()
  const { height: frameHeight } = useSafeAreaFrame()
  const [size, setSize] = useState<CGSize | null>(null)
  const { sizeStyle, sizeInverted } = useMemo<{
    sizeStyle: ViewStyle | undefined
    sizeInverted: boolean
  }>(() => {
    if (!size) {
      return {
        sizeStyle: undefined,
        sizeInverted: false,
      }
    }
    const { x, y, width, height } = size
    let marginTop = y + height + topInset + offsetY
    let inverted = false
    if (marginTop + contentHeight > frameHeight) {
      marginTop = y - contentHeight + topInset - offsetY
      inverted = true
    }
    return {
      sizeStyle: {
        marginLeft: x,
        marginTop,
        width,
      },
      sizeInverted: inverted,
    }
  }, [size, contentHeight, topInset, frameHeight])

  const anim = useSharedValue(0)
  const show = () => {
    containerRef.current?.measureInWindow((x, y, width, height) => {
      console.log({ x, y, width, height })
      wasKeyboardVisibleWhenShowingRef.current = isKeyboardVisibleRef.current
      Keyboard.dismiss()
      setSize({ x, y, width, height })
      setVisible(true)
      anim.value = withTiming(1, WITH_TIMING_CONFIG)
    })
  }
  const dismiss = () => {
    anim.value = withTiming(0, WITH_TIMING_CONFIG, () => {
      runOnJS(setVisible)(false)
    })
  }

  const presentAnimStyle = useAnimatedStyle(() => {
    const outputRange = sizeInverted ? [contentHeight, 0] : [-contentHeight, 0]
    return {
      height: contentHeight,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], outputRange, Extrapolation.CLAMP),
        },
      ],
    }
  })

  return (
    <>
      <Pressable disabled={disabled} onPress={show}>
        <View ref={containerRef} style={style}>
          {renderContent({ value, label: valueToLabel(value), anim })}
        </View>
      </Pressable>
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        animationIn="fadeIn"
        animationInTiming={1}
        animationOut="fadeOut"
        animationOutTiming={1}
        deviceHeight={frameHeight}
        statusBarTranslucent={true}
        coverScreen={true}
        backdropOpacity={0}
        onBackdropPress={dismiss}
        onDismiss={() => {
          onDismiss?.({
            wasKeyboardVisibleWhenShowing: wasKeyboardVisibleWhenShowingRef.current,
          })
        }}>
        <View style={[sizeStyle, { overflow: 'hidden' }]}>
          <Animated.View
            style={[
              {
                backgroundColor: selectorBackgroundColor,
                borderRadius: 4,
                overflow: 'hidden',
              },
              presentAnimStyle,
              selectorStyle,
            ]}>
            <FlatList
              style={{ height: contentHeight }}
              data={values as T[]}
              showsVerticalScrollIndicator={false}
              initialScrollIndex={initialScrollIndex}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              keyExtractor={(item, index) => `${index}_${item}`}
              renderItem={({ item }) => {
                const isSelected = item === value
                return (
                  <PickSelectorItemView
                    style={[styles.item, itemStyle]}
                    labelStyle={labelStyle}
                    label={valueToLabel(item)}
                    isSelected={isSelected}
                    onPress={() => {
                      onValueChange(item)
                      setTimeout(() => dismiss(), 600)
                    }}
                  />
                )
              }}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

type Styles = {
  modal: ViewStyle
  item: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  modal: {
    margin: 0,
    padding: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  item: {
    width: '100%',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
})

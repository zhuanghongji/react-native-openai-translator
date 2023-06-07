import { Button } from '../../components/Button'
import { SvgIcon } from '../../components/SvgIcon'
import { hapticError, hapticSoft, hapticSuccess } from '../../haptic'
import { requestOpenAIModels } from '../../http/apis/v1/models'
import { print } from '../../printer'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { BottomInput } from './BottomInput'
import BottomSheet from '@gorhom/bottom-sheet'
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

const BOTTOM = 32

type ApiKeyVerifyResult = { [apiKey: string]: boolean }

export type BottomViewProps = {
  style?: StyleProp<ViewStyle>
  apiKey: string
  onChangeApiKey: (value: string) => void
}

export type BottomViewHandle = {
  expand: () => void
  collapse: () => void
}

export const BottomView = React.forwardRef<BottomViewHandle, BottomViewProps>((props, ref) => {
  const { style, apiKey, onChangeApiKey } = props

  const { t } = useTranslation()

  const { width: frameWidth, height: frameHeight } = useSafeAreaFrame()
  const minSheetHeight = frameHeight * 0.5
  const maxSheetHeight = frameHeight * 0.7

  const confirmButtonWidth = frameWidth - dimensions.edgeTwice * 2

  const [keysList, setKeysList] = useState<string[]>(() => {
    if (!apiKey) {
      return ['']
    }
    return apiKey.split(',')
  })
  const addDisabled = keysList.length < 3 && keysList[keysList.length - 1] ? false : true

  const [verifyResult, setVerifyResult] = useState<ApiKeyVerifyResult>({})
  const valuableKeys = keysList.filter(v => (v.trim() ? true : false))
  const valuableKeysEmpty = valuableKeys.length === 0

  const [verifying, setVerifying] = useState(false)
  const onVerifyPress = async () => {
    try {
      Keyboard.dismiss()
      hapticSoft()
      setVerifying(true)
      const results = await Promise.allSettled(valuableKeys.map(v => requestOpenAIModels(v)))
      const _verifyResult: ApiKeyVerifyResult = {}
      results.forEach((v, index) => {
        _verifyResult[valuableKeys[index]] = v.status === 'fulfilled'
      })
      setVerifyResult(prev => ({ ...prev, ..._verifyResult }))
      if (results.every(v => v.status === 'fulfilled')) {
        hapticSuccess()
      } else {
        hapticError()
      }
      setVerifying(false)
    } catch (e) {
      print('error', e)
      hapticError()
      setVerifying(false)
    }
  }

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(
    () => [minSheetHeight, maxSheetHeight],
    [minSheetHeight, maxSheetHeight]
  )

  const animatedIndex = useSharedValue(0)
  const confirmAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 1], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(
            animatedIndex.value,
            [0, 1],
            [0, 48 + BOTTOM],
            Extrapolation.CLAMP
          ),
        },
      ],
    }
  })

  useImperativeHandle(ref, () => ({
    expand: () => bottomSheetRef.current?.snapToIndex(1),
    collapse: () => bottomSheetRef.current?.snapToIndex(0),
  }))

  useEffect(() => {
    const subscrition = Keyboard.addListener('keyboardDidShow', () => {
      bottomSheetRef.current?.snapToIndex(1)
    })
    return () => subscrition.remove()
  }, [])
  useEffect(() => {
    const subscrition = Keyboard.addListener('keyboardDidHide', () => {
      bottomSheetRef.current?.snapToIndex(0)
    })
    return () => subscrition.remove()
  }, [])

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        style={style}
        index={0}
        snapPoints={snapPoints}
        handleComponent={null}
        animatedIndex={animatedIndex}
        enableContentPanningGesture={false}
        backgroundStyle={[styles.borderRadius, styles.background]}>
        <ScrollView
          style={[styles.borderRadius, styles.scrollView]}
          contentContainerStyle={styles.contentContainer}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled">
          {keysList.map((v, index) => {
            return (
              <BottomInput
                key={`${index}`}
                index={index}
                value={v}
                verified={verifyResult[v]}
                verifying={verifying}
                onChangeText={value => {
                  const newList = [...keysList]
                  newList[index] = value
                  setKeysList(newList)
                }}
              />
            )
          })}

          <View style={styles.actionsRow}>
            <Pressable
              hitSlop={dimensions.hitSlop}
              style={{ opacity: valuableKeysEmpty ? dimensions.disabledOpacity : 1 }}
              disabled={valuableKeysEmpty}
              onPress={onVerifyPress}>
              <Text style={{ color: colors.primary }}>VERIFY</Text>
            </Pressable>
            {verifying ? (
              <ActivityIndicator
                style={{ marginLeft: dimensions.edge }}
                color={colors.white}
                size="small"
              />
            ) : null}

            <View style={stylez.f1} />
            <Pressable
              style={{ opacity: addDisabled ? dimensions.disabledOpacity : 1 }}
              disabled={addDisabled}
              onPress={() => {
                setKeysList([...keysList, ''])
              }}>
              <SvgIcon size={dimensions.iconLarge} color={colors.white} name="add" />
            </Pressable>
          </View>
        </ScrollView>
      </BottomSheet>

      <Animated.View style={[styles.confirmContainer, confirmAnimStyle]}>
        <Button
          style={[
            styles.confirmButton,
            {
              width: confirmButtonWidth,
            },
          ]}
          text={valuableKeysEmpty ? t('SKIP') : t('CONFIRM')}
          onPress={() => {
            hapticSoft()
            const values = keysList
              .map(v => v.trim())
              .filter(v => {
                if (!v) {
                  return false
                }
                if (verifyResult[v] === false) {
                  return false
                }
                return true
              })
            onChangeApiKey([...new Set(values)].join(','))
          }}
        />
      </Animated.View>
    </>
  )
})

type Styles = {
  borderRadius: ViewStyle
  background: ViewStyle
  scrollView: ViewStyle
  contentContainer: ViewStyle
  actionsRow: ViewStyle
  confirmContainer: ViewStyle
  confirmButton: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  borderRadius: {
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    overflow: 'hidden',
  },
  background: {
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: dimensions.edgeTwice,
    paddingBottom: BOTTOM,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: dimensions.edgeTwice,
    paddingVertical: dimensions.edge,
    alignItems: 'center',
  },
  confirmContainer: {
    position: 'absolute',
    left: dimensions.edgeTwice,
    bottom: BOTTOM,
  },
  confirmButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFFFFF66',
    backgroundColor: '#333233',
  },
})

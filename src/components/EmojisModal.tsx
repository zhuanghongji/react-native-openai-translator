import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { emojis } from '../res/emojis'
import { useThemeDark } from '../themes/hooks'
import { EmojisModalScene } from './EmojisModalScene'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { TabBar, TabView } from 'react-native-tab-view'

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
  const { width: frameWidth } = useSafeAreaFrame()
  const itemWidth = (frameWidth - dimensions.edgeTwice) / NUM_COLUMNS

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [snapHeight], [snapHeight])

  const [tabIndex, setTabIndex] = useState(0)
  const [routes] = useState([
    { key: 'smileys', title: 'smileys', index: 0, emojiList: emojis.smileys },
    { key: 'peoples', title: 'peoples', index: 1, emojiList: emojis.peoples },
    { key: 'natures', title: 'natures', index: 1, emojiList: emojis.natures },
    { key: 'foods', title: 'foods', index: 1, emojiList: emojis.foods },
    { key: 'activities', title: 'activities', index: 1, emojiList: emojis.activities },
    { key: 'places', title: 'places', index: 1, emojiList: emojis.places },
    { key: 'symbols', title: 'symbols', index: 1, emojiList: emojis.symbols },
    { key: 'flags', title: 'flags', index: 1, emojiList: emojis.flags },
  ])

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
      <TabView
        lazy={true}
        lazyPreloadDistance={1}
        tabBarPosition="bottom"
        navigationState={{ index: tabIndex, routes }}
        renderTabBar={options => {
          return (
            <TabBar
              {...options}
              style={{ backgroundColor: colors.white }}
              tabStyle={{ width: frameWidth / 3.5 }}
              labelStyle={{ fontWeight: 'bold' }}
              indicatorStyle={{ backgroundColor: colors.black, height: 4, borderRadius: 2 }}
              scrollEnabled={true}
              activeColor={colors.black}
              inactiveColor={colors.c99}
              pressColor={colors.transparent}
            />
          )
        }}
        renderScene={({ route }) => {
          return (
            <EmojisModalScene
              itemWidth={itemWidth}
              numColumns={NUM_COLUMNS}
              emojiList={route.emojiList}
              onEmojiPress={onEmojiPress}
            />
          )
        }}
        onIndexChange={setTabIndex}
      />
    </BottomSheetModal>
  )
})

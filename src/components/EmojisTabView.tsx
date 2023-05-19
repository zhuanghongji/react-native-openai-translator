import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { emojis } from '../res/emojis'
import { EmojisModalScene } from './EmojisModalScene'
import React, { useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { TabBar, TabView } from 'react-native-tab-view'

const NUM_COLUMNS = 8

export type EmojisTabViewProps = {
  style?: StyleProp<ViewStyle>
  onEmojiPress: (value: string) => void
}

export function EmojisTabView(props: EmojisTabViewProps) {
  const { style, onEmojiPress } = props

  const { width: frameWidth } = useSafeAreaFrame()
  const itemWidth = (frameWidth - dimensions.edgeTwice) / NUM_COLUMNS

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

  return (
    <TabView
      style={style}
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
  )
}

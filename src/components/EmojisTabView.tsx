import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { emojis } from '../res/emojis'
import { EmojisModalScene } from './EmojisModalScene'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { TabBar, TabView } from 'react-native-tab-view'

const NUM_COLUMNS = 8

export type EmojisTabViewProps = {
  style?: StyleProp<ViewStyle>
  tabBarPosition?: 'top' | 'bottom'
  onEmojiPress: (value: string) => void
}

export function EmojisTabView(props: EmojisTabViewProps) {
  const { style, tabBarPosition, onEmojiPress } = props

  const { width: frameWidth } = useSafeAreaFrame()
  const itemWidth = (frameWidth - dimensions.edgeTwice) / NUM_COLUMNS

  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)

  const routes = useMemo(() => {
    return [
      { key: 'smileys', title: t('smileys'), index: 0, emojiList: emojis.smileys },
      { key: 'peoples', title: t('peoples'), index: 1, emojiList: emojis.peoples },
      { key: 'natures', title: t('natures'), index: 1, emojiList: emojis.natures },
      { key: 'foods', title: t('foods'), index: 1, emojiList: emojis.foods },
      { key: 'activities', title: t('activities'), index: 1, emojiList: emojis.activities },
      { key: 'places', title: t('places'), index: 1, emojiList: emojis.places },
      { key: 'symbols', title: t('symbols'), index: 1, emojiList: emojis.symbols },
      { key: 'flags', title: t('flags'), index: 1, emojiList: emojis.flags },
    ]
  }, [t])

  return (
    <TabView
      style={[{ flex: 1 }, style]}
      lazy={true}
      lazyPreloadDistance={1}
      tabBarPosition={tabBarPosition}
      navigationState={{ index: tabIndex, routes }}
      renderTabBar={options => {
        return (
          <TabBar
            {...options}
            style={{ backgroundColor: colors.white }}
            tabStyle={{ width: frameWidth / 3.5 }}
            labelStyle={{ fontWeight: 'bold' }}
            indicatorStyle={{ backgroundColor: colors.black, height: 2, borderRadius: 1 }}
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

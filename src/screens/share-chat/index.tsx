import { TitleBar } from '../../components/TitleBar'
import { DEFAULTS } from '../../preferences/defaults'
import { colors } from '../../res/colors'
import { stylez } from '../../res/stylez'
import { useThemeScheme } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { ShotScene } from './ShotScene'
import { TextScene } from './TextScene'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Route, TabBar, TabView } from 'react-native-tab-view'

type Props = NativeStackScreenProps<RootStackParamList, 'ShareChat'>

type ShareRoute = Route & {
  key: string
  title: string
}

export function ShareChatScreen({ navigation: _, route: navRoute }: Props): JSX.Element {
  const { avatar, avatarName, fontSize = DEFAULTS.fontSize, messages } = navRoute.params

  const { background } = useThemeScheme()
  const { t } = useTranslation()

  const [tabIndex, setTabIndex] = useState(0)
  const [routes] = useState<ShareRoute[]>([
    { key: 'shot', title: t('View Shot') },
    { key: 'text', title: t('Plain Text') },
  ])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={['bottom']}>
      <TitleBar title={t('Share Dialogue')} />
      <TabView
        style={stylez.f1}
        lazy={true}
        lazyPreloadDistance={1}
        navigationState={{ index: tabIndex, routes }}
        renderTabBar={options => {
          return (
            <TabBar
              {...options}
              style={{ backgroundColor: colors.transparent, elevation: 0 }}
              labelStyle={{ fontWeight: 'bold' }}
              indicatorStyle={{ backgroundColor: colors.black }}
              activeColor={colors.black}
              inactiveColor={colors.c99}
              pressColor={colors.transparent}
            />
          )
        }}
        renderScene={({ route }) => {
          const { key } = route
          switch (key) {
            case 'shot':
              return (
                <ShotScene
                  avatar={avatar}
                  avatarName={avatarName}
                  fontSize={fontSize}
                  messages={messages}
                />
              )
            case 'text':
              return <TextScene fontSize={fontSize} messages={messages} />
            default:
              return null
          }
        }}
        onIndexChange={setTabIndex}
      />
    </SafeAreaView>
  )
}

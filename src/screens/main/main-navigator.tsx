/* eslint-disable react/no-unstable-nested-components */
import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { useThemeScheme } from '../../themes/hooks'
import type { MainTabParamList, RootStackParamList } from '../screens'
import { ChatsScreen } from './chats'
import { DiscoverScreen } from './discover'
import { HomeScreen } from './home'
import { MeScreen } from './me'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

type RouteName = keyof MainTabParamList

const TAB_ICONS: Record<RouteName, SvgIconName> = {
  Modes: 'motion',
  Chats: 'standby',
  Discover: 'explore',
  Me: 'account',
}

const Tab = createBottomTabNavigator()

export function MainNavigator(_: Props): JSX.Element {
  const { t } = useTranslation()
  const tabNames: Record<RouteName, string> = {
    Modes: t('Modes'),
    Chats: t('Chats'),
    Discover: t('Discover'),
    Me: t('Me'),
  }

  const { tint, tint3 } = useThemeScheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: false,
        headerShown: false,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: tint3,
        tabBarIcon: ({ color, size }) => {
          const routeName = route.name as RouteName
          const iconName = TAB_ICONS[routeName]
          return <SvgIcon name={iconName} size={size} color={color} />
        },
        tabBarLabel: ({ color }) => {
          const routeName = route.name as RouteName
          return (
            <Text style={{ color, fontSize: 12, transform: [{ translateY: -4 }] }}>
              {tabNames[routeName]}
            </Text>
          )
        },
      })}>
      <Tab.Screen name="Modes" component={HomeScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  )
}

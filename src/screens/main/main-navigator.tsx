/* eslint-disable react/no-unstable-nested-components */
import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import type { MainTabParamList, RootStackParamList } from '../screens'
import { ChatsScreen } from './chats'
import { DiscoverScreen } from './discover'
import { MeScreen } from './me'
import { ModesScreen } from './modes'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

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

  const { textActive, textInactive, backgroundBar: backgroundColor } = useThemeScheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: false,
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor }],
        tabBarActiveTintColor: textActive,
        tabBarInactiveTintColor: textInactive,
        tabBarIcon: ({ color }) => {
          const routeName = route.name as RouteName
          const iconName = TAB_ICONS[routeName]
          return <SvgIcon name={iconName} size={dimensions.iconLarge} color={color} />
        },
        tabBarLabel: ({ color }) => {
          const routeName = route.name as RouteName
          return <Text style={[styles.tabBarLabel, { color }]}>{tabNames[routeName]}</Text>
        },
      })}>
      <Tab.Screen name="Modes" component={ModesScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  )
}

type Styles = {
  tabBar: ViewStyle
  tabBarLabel: TextStyle
}

const styles = StyleSheet.create<Styles>({
  tabBar: {
    height: 56,
    borderTopColor: colors.transparent,
  },
  tabBarLabel: { fontSize: 11, transform: [{ translateY: -6 }] },
})

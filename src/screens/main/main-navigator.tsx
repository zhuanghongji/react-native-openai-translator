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

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

type RouteName = keyof MainTabParamList

const TAB_ICONS: Record<RouteName, SvgIconName> = {
  Modes: 'model-training',
  Chats: 'sms',
  Discover: 'explore',
  Me: 'person',
}

const Tab = createBottomTabNavigator()

export function MainNavigator({ navigation }: Props): JSX.Element {
  const { tint, tint3 } = useThemeScheme()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: tint3,
        tabBarLabelStyle: { transform: [{ translateY: -4 }] },
        tabBarIcon: ({ color, size }) => {
          const routeName = route.name as RouteName
          const iconName = TAB_ICONS[routeName]
          return <SvgIcon name={iconName} size={size} color={color} />
        },
      })}>
      <Tab.Screen name="Modes" component={HomeScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  )
}

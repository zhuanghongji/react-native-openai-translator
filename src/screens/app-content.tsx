import { colors } from '../res/colors'
import { useThemeDark } from '../themes/hooks'
import { HomeScreen } from './main/home'
import { ModeChatScreen } from './mode-chat'
import { ScannerScreen } from './scanner'
import { RootStackParamList } from './screens'
import { SettingsScreen } from './settings'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import type { IColors } from 'react-native-alert-notification/lib/typescript/service'

const RootStack = createNativeStackNavigator<RootStackParamList>()

const COLORS: [IColors, IColors] = [
  // light
  {
    label: colors.black,
    card: colors.cE2,
    overlay: colors.overlayLight,
    success: colors.primary,
    danger: colors.warning,
    warning: colors.warning,
  },
  // dark
  {
    label: colors.white,
    card: colors.c24,
    overlay: colors.overlayDark,
    success: colors.primary,
    danger: colors.warning,
    warning: colors.warning,
  },
]

export function AppContent(): JSX.Element {
  const dark = useThemeDark()
  return (
    <AlertNotificationRoot theme={dark ? 'dark' : 'light'} colors={COLORS}>
      <RootStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
        <RootStack.Screen name="Scanner" component={ScannerScreen} />
        <RootStack.Screen name="ModeChat" component={ModeChatScreen} />
      </RootStack.Navigator>
    </AlertNotificationRoot>
  )
}

import { colors } from '../res/colors'
import { useThemeDark } from '../themes/hooks'
import { TemplateScreen } from './_template'
import { ApiKeysScreen } from './api-keys'
import { AwesomePromptsScreen } from './awesome-prompts'
import { CustomChatScreen } from './custom-chat'
import { CustomChatInitScreen } from './custom-chat-init'
import { DevScreen } from './dev'
import { MainNavigator } from './main/main-navigator'
import { ModeChatScreen } from './mode-chat'
import { ModeResultCollectedScreen } from './mode-result-collected'
import { ModeResultRecordsScreen } from './mode-result-records'
import { ModeWordCollectedScreen } from './mode-word-collected'
import { ModeWordRecordsScreen } from './mode-word-records'
import { PDFScreen } from './pdf'
import { ScannerScreen } from './scanner'
import { RootStackParamList } from './screens'
import { SettingsScreen } from './settings'
import { ShareChatScreen } from './share-chat'
import { WebScreen } from './web'
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
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}>
        <RootStack.Screen name="Main" component={MainNavigator} />
        <RootStack.Screen name="Dev" component={DevScreen} />
        <RootStack.Screen name="Template" component={TemplateScreen} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
        <RootStack.Screen name="Scanner" component={ScannerScreen} />
        <RootStack.Screen name="ModeChat" component={ModeChatScreen} />
        <RootStack.Screen name="CustomChat" component={CustomChatScreen} />
        <RootStack.Screen name="CustomChatInit" component={CustomChatInitScreen} />
        <RootStack.Screen name="AwesomePrompts" component={AwesomePromptsScreen} />
        <RootStack.Screen name="ModeWordCollected" component={ModeWordCollectedScreen} />
        <RootStack.Screen name="ModeWordRecords" component={ModeWordRecordsScreen} />
        <RootStack.Screen name="ModeResultCollected" component={ModeResultCollectedScreen} />
        <RootStack.Screen name="ModeResultRecords" component={ModeResultRecordsScreen} />
        <RootStack.Screen name="ShareChat" component={ShareChatScreen} />
        <RootStack.Screen name="Web" component={WebScreen} />
        <RootStack.Screen name="PDF" component={PDFScreen} />
        <RootStack.Screen
          name="ApiKeys"
          component={ApiKeysScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </RootStack.Navigator>
    </AlertNotificationRoot>
  )
}

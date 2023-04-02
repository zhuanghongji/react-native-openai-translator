import { ChatScreen } from './screens/chat'
import { HomeScreen } from './screens/home'
import { ScannerScreen } from './screens/scanner'
import { RootStackParamList } from './screens/screens'
import { SettingsScreen } from './screens/settings'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const RootStack = createNativeStackNavigator<RootStackParamList>()

export function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <KeyboardProvider>
          <NavigationContainer>
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
              <RootStack.Screen name="Chat" component={ChatScreen} />
            </RootStack.Navigator>
          </NavigationContainer>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

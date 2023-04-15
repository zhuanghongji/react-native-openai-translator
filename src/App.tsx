import './i18n/config'
import { AppContent } from './screens/app-content'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'

export function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider statusBarTranslucent>
        <SafeAreaProvider style={{ flex: 1 }}>
          <NavigationContainer
            onReady={() => {
              if (Platform.OS === 'ios') {
                SplashScreen.hide()
              } else {
                setTimeout(() => SplashScreen.hide(), 600)
              }
            }}>
            <AppContent />
          </NavigationContainer>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}

import { dbInitTables } from './db/initializer'
import './i18n/config'
import {
  queryClient,
  useHttpQueryAppFocusManager,
  useHttpQueryAppOnlineManager,
} from './query/client'
import { AppContent } from './screens/AppContent'
import { ThemeSchemeProvider } from './themes/ThemeSchemeProvider'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'

export function App(): JSX.Element {
  useEffect(() => {
    dbInitTables()
  }, [])

  // react-qeury
  useHttpQueryAppFocusManager()
  useHttpQueryAppOnlineManager()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider statusBarTranslucent>
          <SafeAreaProvider style={{ flex: 1 }}>
            <ThemeSchemeProvider>
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
            </ThemeSchemeProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

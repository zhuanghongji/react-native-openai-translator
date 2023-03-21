import React from 'react'
import { useColorScheme, StatusBar, View, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  }

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <Text>App</Text>
      </View>
    </SafeAreaProvider>
  )
}

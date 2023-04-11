/**
 * @format
 */
import { name as appName } from './app.json'
import { App } from './src/App'
import { AppRegistry, LogBox } from 'react-native'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `tts-finish` with no listeners registered.',
  'i18next: init: i18next is already initialized. You should call init just once!',
])

AppRegistry.registerComponent(appName, () => App)

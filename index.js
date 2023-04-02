/**
 * @format
 */
import { name as appName } from './app.json'
import { App } from './src/App'
import { AppRegistry, LogBox } from 'react-native'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `tts-finish` with no listeners registered.',
])

AppRegistry.registerComponent(appName, () => App)

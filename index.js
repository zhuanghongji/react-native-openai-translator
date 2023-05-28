/**
 * @format
 */
import { name as appName } from './app.json'
import { App } from './src/App'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { AppRegistry, LogBox } from 'react-native'

// date format
dayjs.extend(localizedFormat)
dayjs.extend(calendar)

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `tts-finish` with no listeners registered.',
  'i18next: init: i18next is already initialized. You should call init just once!',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
])

AppRegistry.registerComponent(appName, () => App)

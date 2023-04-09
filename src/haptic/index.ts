import ReactNativeHapticFeedback, { HapticOptions } from 'react-native-haptic-feedback'

const DEFAULT_OPTIONS: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
}

export function hapticLight(options: HapticOptions = DEFAULT_OPTIONS) {
  ReactNativeHapticFeedback.trigger('impactLight', options)
}

export function hapticSuccess(options: HapticOptions = DEFAULT_OPTIONS) {
  ReactNativeHapticFeedback.trigger('notificationSuccess', options)
}

export function hapticWarning(options: HapticOptions = DEFAULT_OPTIONS) {
  ReactNativeHapticFeedback.trigger('notificationWarning', options)
}

export function hapticError(options: HapticOptions = DEFAULT_OPTIONS) {
  ReactNativeHapticFeedback.trigger('notificationError', options)
}

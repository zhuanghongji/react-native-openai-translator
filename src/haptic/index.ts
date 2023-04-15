import HapticFeedback, { HapticOptions } from 'react-native-haptic-feedback'

const DEFAULT_OPTIONS: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

export function hapticLight(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('impactLight', options)
}

export function hapticSuccess(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('notificationSuccess', options)
}

export function hapticWarning(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('notificationWarning', options)
}

export function hapticError(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('notificationError', options)
}

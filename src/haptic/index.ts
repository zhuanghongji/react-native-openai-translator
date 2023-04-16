import HapticFeedback, { HapticOptions } from 'react-native-haptic-feedback'

const DEFAULT_OPTIONS: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

export function hapticSoft(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('soft', options)
}

export function hapticRigid(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('rigid', options)
}

export function hapticLight(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('impactLight', options)
}

export function hapticMedium(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('impactMedium', options)
}

export function hapticHeavy(options: HapticOptions = DEFAULT_OPTIONS) {
  HapticFeedback.trigger('impactHeavy', options)
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

import { ALERT_TYPE, Toast } from 'react-native-alert-notification'

type Type = 'success' | 'warning' | 'danger'
const TYPE_MAP: Record<Type, ALERT_TYPE> = {
  success: ALERT_TYPE.SUCCESS,
  warning: ALERT_TYPE.WARNING,
  danger: ALERT_TYPE.DANGER,
}

const MAX_LENGTH_OF_CONTENT = 72

export function toast(type: Type, title: string, content: string, onPress?: () => void) {
  const textBody =
    content.length < MAX_LENGTH_OF_CONTENT
      ? content
      : `${content.substring(0, MAX_LENGTH_OF_CONTENT)}...`
  Toast.show({
    autoClose: 1800,
    type: TYPE_MAP[type],
    title,
    textBody,
    onPress,
  })
}

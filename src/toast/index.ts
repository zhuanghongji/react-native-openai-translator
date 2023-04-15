import { ALERT_TYPE, Toast } from 'react-native-alert-notification'

type Type = 'success' | 'warning' | 'danger'
const TYPE_MAP: Record<Type, ALERT_TYPE> = {
  success: ALERT_TYPE.SUCCESS,
  warning: ALERT_TYPE.WARNING,
  danger: ALERT_TYPE.DANGER,
}

export function toast(type: Type, title: string, content: string, maxContentLength = 48) {
  const textBody =
    content.length < maxContentLength ? content : `${content.substring(0, maxContentLength)}...`
  Toast.show({
    type: TYPE_MAP[type],
    title,
    textBody,
  })
}

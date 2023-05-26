import { dimensions } from './dimensions'
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

type Stylez = {
  f1: ViewStyle
  contentText: TextStyle
  chatAvatarLogo: ImageStyle
  chatAvatarContainer: ViewStyle
  chatAvatarContainerHidden: ViewStyle
}

export const stylez = StyleSheet.create<Stylez>({
  f1: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
  chatAvatarLogo: {
    width: 18,
    height: 18,
  },
  chatAvatarContainer: {
    width: dimensions.chatAvatar,
    height: dimensions.chatAvatar,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 8,
  },
  chatAvatarContainerHidden: {
    width: dimensions.messageSeparator,
  },
})

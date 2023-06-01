import { colors } from './colors'
import { dimensions } from './dimensions'
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

type Stylez = {
  f1: ViewStyle
  w100: ViewStyle
  h100: ViewStyle
  wh100: ViewStyle
  contentText: TextStyle
  chatAvatarLogo: ImageStyle
  chatAvatarContainer: ViewStyle
  chatAvatarContainerHidden: ViewStyle
  modal: ViewStyle
  tabViewBar: ViewStyle
  tabViewLabel: TextStyle
  tabViewIndicator: ViewStyle
}

export const stylez = StyleSheet.create<Stylez>({
  f1: {
    flex: 1,
  },
  w100: {
    width: '100%',
  },
  h100: {
    height: '100%',
  },
  wh100: {
    width: '100%',
    height: '100%',
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
  modal: {
    borderTopLeftRadius: dimensions.modalRadius,
    borderTopRightRadius: dimensions.modalRadius,
    overflow: 'hidden',
  },
  tabViewBar: {
    backgroundColor: colors.transparent,
    shadowColor: colors.transparent,
    elevation: 0,
  },
  tabViewLabel: {
    fontWeight: 'bold',
  },
  tabViewIndicator: {
    height: 2,
    borderRadius: 1,
  },
})

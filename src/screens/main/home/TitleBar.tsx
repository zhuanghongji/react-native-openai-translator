import { SvgIcon } from '../../../components/SvgIcon'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { images } from '../../../res/images'
import { TText } from '../../../themes/TText'
import { useStatusBarStyle, useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import {
  Image,
  ImageStyle,
  Pressable,
  StatusBar,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarProps {
  onScannerPress: () => void
  onSettingsPress: () => void
}

const H_EDGE = 8

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onScannerPress, onSettingsPress } = props
  const { top } = useSafeAreaInsets()

  const barStyle = useStatusBarStyle()

  const { tint: iconColor } = useThemeScheme()

  return (
    <View style={[styles.container, { height: dimensions.barHeight + top, paddingTop: top }]}>
      <StatusBar translucent barStyle={barStyle} backgroundColor={colors.transparent} />
      <View style={styles.touchable} />
      <View style={styles.touchable} />
      <View style={styles.center}>
        <Image style={styles.logo} source={images.logo} />
        <TText style={styles.title} typo="text">
          OpenAI Translator
        </TText>
      </View>
      <Pressable style={styles.touchable} onPress={onScannerPress}>
        <SvgIcon size={dimensions.iconMedium} color={iconColor} name="scanner" />
      </Pressable>
      <Pressable style={styles.touchable} hitSlop={{ right: H_EDGE }} onPress={onSettingsPress}>
        <SvgIcon size={dimensions.iconMedium} color={iconColor} name="settings" />
      </Pressable>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  touchable: ViewStyle
  center: ViewStyle
  logo: ImageStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_EDGE,
    width: '100%',
  },
  touchable: {
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 20,
    height: 20,
  },
  title: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
})

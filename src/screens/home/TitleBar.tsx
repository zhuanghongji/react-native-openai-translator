import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { images } from '../../res/images'
import { useImageThemeColor, useStatusBarStyle } from '../../themes/hooks'
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
  onSettingsPress: () => void
}

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onSettingsPress } = props
  const { top } = useSafeAreaInsets()
  const barStyle = useStatusBarStyle()
  const iconColor = useImageThemeColor('tint')
  return (
    <View style={[styles.container, { height: 48 + top, paddingTop: top }]}>
      <StatusBar
        translucent
        barStyle={barStyle}
        backgroundColor="transparent"
      />
      <View style={styles.touchable} />
      <View style={styles.center}>
        <Image style={styles.logo} source={images.logo} />
        <TText style={styles.title} type="title">
          OpenAI Translator
        </TText>
      </View>
      <Pressable style={styles.touchable} onPress={onSettingsPress}>
        <SvgIcon
          size={dimensions.iconMedium}
          color={iconColor}
          name="settings"
        />
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
    width: '100%',
  },
  touchable: {
    width: 48,
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

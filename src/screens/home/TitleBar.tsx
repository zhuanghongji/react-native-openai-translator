import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { images } from '../../res/images'
import { useImageThemeColor } from '../../themes/hooks'
import React from 'react'
import {
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

export interface TitleBarProps {
  onSettingsPress: () => void
}

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onSettingsPress } = props
  const iconColor = useImageThemeColor('tint')
  return (
    <View style={styles.container}>
      <View style={styles.touchable} />
      <View style={styles.center}>
        <Image style={styles.logo} source={images.logo} />
        <TText style={styles.title} type="title">
          OpenAI Translator
        </TText>
      </View>
      <TouchableOpacity style={styles.touchable} onPress={onSettingsPress}>
        <SvgIcon
          size={dimensions.iconMedium}
          color={iconColor}
          name="settings"
        />
      </TouchableOpacity>
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
    height: 48,
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

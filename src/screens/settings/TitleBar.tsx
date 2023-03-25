import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { useImageThemeColor, useStatusBarStyle } from '../../themes/hooks'
import React from 'react'
import { StatusBar, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarProps {
  onBackPress: () => void
}

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onBackPress } = props
  const { top } = useSafeAreaInsets()
  const barStyle = useStatusBarStyle()
  const iconColor = useImageThemeColor('tint')
  return (
    <LinearGradient
      style={[styles.container, { height: 48 + top, paddingTop: top }]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={['#F1F0FC', '#EAECFD', '#D2E6FC', '#EEF8FE', '#FBFBFD']}>
      <StatusBar
        translucent
        barStyle={barStyle}
        backgroundColor="transparent"
      />
      <TouchableOpacity style={styles.touchable} onPress={onBackPress}>
        <SvgIcon size={dimensions.iconMedium} color={iconColor} name="back" />
      </TouchableOpacity>
      <View style={styles.center}>
        <TText style={styles.title} type="title">
          Settings
        </TText>
      </View>
      <View style={styles.touchable} />
    </LinearGradient>
  )
}

type Styles = {
  container: ViewStyle
  touchable: ViewStyle
  center: ViewStyle
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
  title: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
})

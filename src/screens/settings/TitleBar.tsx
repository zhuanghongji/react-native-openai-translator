import { SvgIcon } from '../../components/SvgIcon'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StatusBar, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LIGHT_COLORS = ['#F1F0FC', '#EAECFD', '#D2E6FC', '#EEF8FE', '#FBFBFD']

export interface TitleBarProps {
  onBackPress: () => void
  onResetPress: () => void
}

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onBackPress, onResetPress } = props
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <LinearGradient
      style={[styles.container, { height: dimensions.barHeight + top, paddingTop: top }]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={LIGHT_COLORS}>
      <StatusBar translucent barStyle="dark-content" backgroundColor={colors.transparent} />
      <Pressable style={styles.touchable} onPress={onBackPress}>
        <SvgIcon size={dimensions.iconMedium} color={colors.black} name="back" />
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>{t('Settings')}</Text>
      </View>
      <Pressable style={styles.touchable} onPress={onResetPress}>
        <SvgIcon size={dimensions.iconMedium} color={colors.black} name="reset" />
      </Pressable>
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
    color: '#000000',
  },
})

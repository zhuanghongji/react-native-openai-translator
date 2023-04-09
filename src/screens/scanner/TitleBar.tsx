import { SvgIcon } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import React from 'react'
import { Pressable, StatusBar, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarProps {
  onBackPress: () => void
}

const H_EDGE = 8

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onBackPress } = props
  const { top } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { height: dimensions.barHeight + top, paddingTop: top }]}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <Pressable style={styles.touchable} hitSlop={{ right: H_EDGE }} onPress={onBackPress}>
        <SvgIcon size={dimensions.iconMedium} color="white" name="back" />
      </Pressable>
      <View style={styles.center} />
      <View style={styles.touchable} />
    </View>
  )
}

type Styles = {
  container: ViewStyle
  touchable: ViewStyle
  center: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
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
})

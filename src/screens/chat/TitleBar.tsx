import { SvgIcon } from '../../components/SvgIcon'
import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import React from 'react'
import {
  Pressable,
  StatusBar,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarProps {
  onBackPress: () => void
  onMorePress: () => void
}

const H_EDGE = 8

export function TitleBar(props: TitleBarProps): JSX.Element {
  const { onBackPress, onMorePress } = props
  const { top } = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        { height: dimensions.barHeight + top, paddingTop: top },
      ]}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <Pressable
        style={styles.touchable}
        hitSlop={{ right: H_EDGE }}
        onPress={onBackPress}>
        <SvgIcon size={dimensions.iconMedium} color="white" name="back" />
      </Pressable>
      <View style={styles.center}>
        <TText style={styles.title} type="title">
          Chat
        </TText>
      </View>
      <Pressable style={styles.touchable} onPress={onMorePress}>
        <SvgIcon size={dimensions.iconLarge} color="white" name="more" />
      </Pressable>
    </View>
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
    paddingHorizontal: H_EDGE,
    width: '100%',
    backgroundColor: 'black',
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
  title: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
})

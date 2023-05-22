import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import { InfiniteQueryFooterType } from './types'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type InfiniteQueryFooterViewProps = {
  style?: StyleProp<ViewStyle>
  type: InfiniteQueryFooterType
  onMorePress?: () => void
  onDonePress?: () => void
  onErrorPress: () => void
}

export const InfiniteQueryFooterView = React.memo((props: InfiniteQueryFooterViewProps) => {
  const { style, type, onMorePress, onDonePress, onErrorPress } = props

  const { tint } = useThemeScheme()
  const containerStyles = [styles.container, style]

  if (type === 'more') {
    return (
      <Pressable style={containerStyles} onPress={onMorePress}>
        <TText style={styles.text} typo="text3">
          {'...'}
        </TText>
      </Pressable>
    )
  }
  if (type === 'loading') {
    return (
      <View style={containerStyles}>
        <ActivityIndicator color={tint} size="small" />
      </View>
    )
  }
  if (type === 'error') {
    return (
      <Pressable style={containerStyles} onPress={onErrorPress}>
        <Text style={[styles.text, { color: colors.warning }]}>{"Lost one's way"}</Text>
      </Pressable>
    )
  }
  if (type === 'done') {
    return (
      <Pressable style={containerStyles} onPress={onDonePress}>
        <TText style={styles.text} typo="text3">
          {'Fully loaded, my friend'}
        </TText>
      </Pressable>
    )
  }
  // none
  return null
})

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: dimensions.cellHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  },
})

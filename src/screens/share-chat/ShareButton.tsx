import { Button } from '../../components/Button'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeSelector } from '../../themes/hooks'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'

export type ShareButtonProps = {
  style?: StyleProp<ViewStyle>
  text: string
  onPress: () => void
}

export function ShareButton(props: ShareButtonProps) {
  const { style, text, onPress } = props

  const { width: frameWidth } = useSafeAreaFrame()
  const { bottom: bottomInset } = useSafeAreaInsets()
  const backgroundColor = useThemeSelector(colors.black, colors.white)

  return (
    <View style={[{ width: '100%', backgroundColor }, style]}>
      <Button
        style={{
          width: frameWidth - dimensions.edgeTwice * 2,
          marginLeft: dimensions.edgeTwice,
          marginTop: dimensions.edge,
          marginBottom: bottomInset + dimensions.edge,
        }}
        text={text}
        onPress={onPress}
      />
    </View>
  )
}

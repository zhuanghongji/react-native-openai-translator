import { SvgIcon } from '../../components/SvgIcon'
import { hapticLight } from '../../haptic'
import { dimensions } from '../../res/dimensions'
import React, { useState } from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

const ICON_SIZE = 27

export interface BottomViewProps {
  style?: StyleProp<ViewStyle>
  comfirmDisabled: boolean
  onConfirmPress: () => void
}

export function BottomView(props: BottomViewProps): JSX.Element {
  const { style, comfirmDisabled, onConfirmPress } = props
  const [flashOn, setFlashOn] = useState(false)

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Pressable
          hitSlop={dimensions.hitSlop}
          onPress={() => {
            hapticLight()
            setFlashOn(!flashOn)
          }}>
          <SvgIcon
            size={ICON_SIZE}
            color="white"
            name={flashOn ? 'flash-on' : 'flash-off'}
          />
        </Pressable>
        <Pressable
          style={[
            styles.outCircle,
            { opacity: comfirmDisabled ? dimensions.disabledOpacity : 1 },
          ]}
          disabled={comfirmDisabled}
          onPress={() => {
            hapticLight()
            onConfirmPress()
          }}>
          <View style={styles.inCircle} />
        </Pressable>
        <Pressable
          hitSlop={dimensions.hitSlop}
          onPress={() => {
            hapticLight()
          }}>
          <SvgIcon size={ICON_SIZE} color="white" name="cached" />
        </Pressable>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  row: ViewStyle
  outCircle: ViewStyle
  inCircle: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 40,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  outCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
  },
})

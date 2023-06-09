import { SvgIcon } from '../../components/SvgIcon'
import { hapticSoft } from '../../haptic'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

const ICON_SIZE = 32

export interface BottomViewProps {
  style?: StyleProp<ViewStyle>
  torchOn: boolean
  torchable: boolean
  comfirmable: boolean
  switchable: boolean
  switchText: string
  onTorchOnChange: (toOn: boolean) => void
  onConfirmPress: () => void
  onSwitchPress: () => void
}

export function BottomView(props: BottomViewProps): JSX.Element {
  const {
    style,
    torchOn,
    torchable,
    comfirmable,
    switchable,
    switchText,
    onTorchOnChange,
    onConfirmPress,
    onSwitchPress,
  } = props

  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'android' ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.white, marginTop: dimensions.edgeTwice }}>
            {t('Text recognition seems not stable on Android')}
          </Text>
        </View>
      ) : null}

      <View style={[styles.row, { marginTop: Platform.OS === 'android' ? 30 : 40 }]}>
        <Pressable
          style={{ opacity: torchable ? 1 : dimensions.disabledOpacity }}
          hitSlop={dimensions.hitSlop}
          disabled={!torchable}
          onPress={() => {
            hapticSoft()
            onTorchOnChange(!torchOn)
          }}>
          <SvgIcon size={ICON_SIZE} color="white" name={torchOn ? 'flash-on' : 'flash-off'} />
        </Pressable>
        <Pressable
          style={[styles.outCircle, { opacity: comfirmable ? 1 : dimensions.disabledOpacity }]}
          hitSlop={dimensions.hitSlop}
          disabled={!comfirmable}
          onPress={() => {
            hapticSoft()
            onConfirmPress()
          }}>
          <View style={styles.inCircle} />
        </Pressable>
        <Pressable
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: switchable ? 1 : dimensions.disabledOpacity,
          }}
          hitSlop={dimensions.hitSlop}
          disabled={!switchable}
          onPress={() => {
            hapticSoft()
            onSwitchPress()
          }}>
          <SvgIcon size={ICON_SIZE} color="white" name="crop" />
          <Text style={{ position: 'absolute', color: 'white', fontSize: 10 }}>{switchText}</Text>
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
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 220,
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
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

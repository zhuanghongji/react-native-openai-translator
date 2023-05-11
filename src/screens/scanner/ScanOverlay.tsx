import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { ScanBlock } from '../../types'
import { ScanAreaView } from './ScanAreaView'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface ScanOverlayProps {
  style?: StyleProp<ViewStyle>
  scanAreaStyle?: StyleProp<ViewStyle>
  scanWidth: number
  scanHeight: number
  scanBlocks: ScanBlock[]
}

export function ScanOverlay(props: ScanOverlayProps): JSX.Element {
  const { style, scanAreaStyle, scanWidth, scanHeight, scanBlocks } = props

  const renderBlocks = () => {
    if (scanBlocks.length === 0) {
      return null
    }
    return (
      <View style={[styles.blocksArea, { width: scanWidth }, style]}>
        {scanBlocks.map(({ text, langs }, index) => {
          return (
            <Text key={`${index}_${text}_${langs}`} style={[stylez.contentText, styles.blockText]}>
              {text}
            </Text>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <ScanAreaView style={scanAreaStyle} width={scanWidth} height={scanHeight} />
      {renderBlocks()}
    </SafeAreaView>
  )
}

type Styles = {
  container: ViewStyle

  blocksArea: ViewStyle
  blockText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    paddingLeft: dimensions.edge,
  },
  blocksArea: {
    marginTop: dimensions.edgeTwice,
    padding: dimensions.edge,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  blockText: {
    textAlign: 'justify',
  },
})

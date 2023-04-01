import { dimensions } from '../../res/dimensions'
import { sheets } from '../../res/sheets'
import React, { useMemo } from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context'
import { OCRFrame } from 'vision-camera-ocr'

export interface ScanOverlayProps {
  pixelRatio: number
  ocrFrame: OCRFrame | null
}

type Block = {
  text: string
  langs: string[]
}

const SCANE_AREAN_START_Y = dimensions.barHeight + 32 + dimensions.edge
const SCANE_AREAN_HEIGHT = 240
const SCANE_AREAN_END_Y = SCANE_AREAN_START_Y + SCANE_AREAN_HEIGHT
const SCANE_AREAN_Y_OFFSET = 64

export function ScanOverlay(props: ScanOverlayProps): JSX.Element {
  const { ocrFrame, pixelRatio } = props
  const { width: frameWidth } = useSafeAreaFrame()
  const scanWidth = frameWidth - dimensions.edge * 2

  const blocks = useMemo<Block[]>(() => {
    if (!ocrFrame || !ocrFrame.result.blocks) {
      return []
    }
    return ocrFrame.result.blocks
      .filter(block => {
        const y = block.frame.y * pixelRatio
        return (
          SCANE_AREAN_START_Y - SCANE_AREAN_Y_OFFSET < y &&
          y < SCANE_AREAN_END_Y + SCANE_AREAN_Y_OFFSET
        )
      })
      .map(block => {
        return {
          text: block.text,
          langs: block.recognizedLanguages,
        }
      })
  }, [ocrFrame, pixelRatio])

  const renderBlocks = () => {
    if (blocks.length === 0) {
      return null
    }
    return (
      <View style={[styles.blocksArea, { width: scanWidth }]}>
        {blocks.map((block, index) => {
          return (
            <Text
              key={`${index}_${block.text}`}
              style={[sheets.contentText, styles.blockText]}>
              {block.text}
            </Text>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents="none">
      <View style={[styles.scanArea, { width: scanWidth, height: 240 }]} />
      {renderBlocks()}
    </SafeAreaView>
  )
}

type Styles = {
  container: ViewStyle
  scanArea: ViewStyle
  blocksArea: ViewStyle
  blockText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {},
  scanArea: {
    marginLeft: dimensions.edge,
    marginTop: SCANE_AREAN_START_Y,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'white',
  },
  blocksArea: {
    marginTop: dimensions.edge * 2,
    marginLeft: dimensions.edge,
    padding: dimensions.edge,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  blockText: {
    textAlign: 'justify',
    padding: 0,
  },
})

import { BottomView } from './BottomView'
import { TextBlockView } from './TextBlockView'
import { TitleBar } from './TitleBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { PixelRatio, View } from 'react-native'
import { runOnJS } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera'
import { OCRFrame, scanOCR } from 'vision-camera-ocr'

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>

export function ScannerScreen({ navigation, route }: Props): JSX.Element {
  const { onScanSuccess } = route.params
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back

  const [hasPermission, setHasPermission] = React.useState(false)
  const [ocrFrame, setOCRFrame] = React.useState<OCRFrame | null>(null)
  const [pixelRatio, setPixelRatio] = React.useState(1)

  useEffect(() => {
    const action = async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'authorized')
    }
    action()
  }, [])

  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    const data = scanOCR(frame)
    console.log(JSON.stringify(data, undefined, '  '))
    runOnJS(setOCRFrame)(data)
  }, [])

  const onConfirmPress = () => {
    if (!ocrFrame) {
      return
    }
    const { text, blocks } = ocrFrame.result
    const lang: string = blocks?.[0]?.recognizedLanguages?.[0] ?? ''
    onScanSuccess({ text, lang })
    navigation.goBack()
  }

  const renderOverlay = () => {
    if (!ocrFrame) {
      return null
    }
    return (
      <>
        {ocrFrame.result.blocks.map((block, index) => {
          return (
            <TextBlockView
              key={`${index}_${block.text}`}
              pixelRatio={pixelRatio}
              block={block}
            />
          )
        })}
      </>
    )
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black' }}
      edges={['left', 'right']}>
      <View style={{ flex: 1 }}>
        {device && hasPermission ? (
          <Camera
            style={{ width: '100%', height: '100%' }}
            device={device}
            isActive={true}
            frameProcessorFps={1}
            frameProcessor={frameProcessor}
            onLayout={event => {
              const { width } = event.nativeEvent.layout
              setPixelRatio(width / PixelRatio.getPixelSizeForLayoutSize(width))
            }}
          />
        ) : null}
        {renderOverlay()}
      </View>
      <BottomView
        comfirmDisabled={ocrFrame === null}
        onConfirmPress={onConfirmPress}
      />
      <TitleBar onBackPress={() => navigation.goBack()} />
    </SafeAreaView>
  )
}

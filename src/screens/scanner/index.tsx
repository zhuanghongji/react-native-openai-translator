import { useIsForeground } from '../../hooks'
import { BottomView } from './BottomView'
import { ScanOverlay } from './ScanOverlay'
import { TitleBar } from './TitleBar'
import { useScanCameraDevice } from './hooks'
import { useIsFocused } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import { PixelRatio, View } from 'react-native'
import { runOnJS } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Camera, useFrameProcessor } from 'react-native-vision-camera'
import { OCRFrame, scanOCR } from 'vision-camera-ocr'

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>

export function ScannerScreen({ navigation, route }: Props): JSX.Element {
  const { onScanSuccess } = route.params

  const cameraRef = useRef<Camera>(null)
  const { device, deviceText, devices, nextDevice } = useScanCameraDevice()
  const switchable = device && devices.length > 0 ? true : false

  const isForeground = useIsForeground()
  const isFocus = useIsFocused()
  const isActive = isForeground && isFocus

  const [pixelRatio, setPixelRatio] = React.useState(1)
  const [authorized, setAuthorized] = useState(false)

  const [torchOn, setTorchOn] = useState(false)
  const torchable = authorized && device?.hasTorch ? true : false
  const torch = torchOn ? 'on' : 'off'

  const [ocrFrame, setOCRFrame] = React.useState<OCRFrame | null>(null)
  const comfirmable = ocrFrame != null
  const onConfirmPress = () => {
    if (!ocrFrame) {
      return
    }
    const { text, blocks } = ocrFrame.result
    const lang: string = blocks?.[0]?.recognizedLanguages?.[0] ?? ''
    onScanSuccess({ text, lang })
    navigation.goBack()
  }

  useEffect(() => {
    const action = async () => {
      const status = await Camera.requestCameraPermission()
      if (status === 'authorized') {
        setAuthorized(true)
        return
      }
      const result = await Camera.requestCameraPermission()
      if (result === 'authorized') {
        setAuthorized(true)
      }
    }
    action()
  }, [])

  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    const data = scanOCR(frame)
    console.log(JSON.stringify(data, undefined, '  '))
    runOnJS(setOCRFrame)(data)
  }, [])

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black' }}
      edges={['left', 'right']}>
      <View
        style={{ flex: 1 }}
        onLayout={event => {
          const { width } = event.nativeEvent.layout
          setPixelRatio(width / PixelRatio.getPixelSizeForLayoutSize(width))
        }}>
        {authorized && device ? (
          <Camera
            ref={cameraRef}
            style={{ width: '100%', height: '100%' }}
            device={device}
            focusable={true}
            isActive={isActive}
            enableZoomGesture={true}
            torch={torch}
            frameProcessorFps={1}
            frameProcessor={frameProcessor}
          />
        ) : null}
      </View>
      {authorized && device ? (
        <ScanOverlay pixelRatio={pixelRatio} ocrFrame={ocrFrame} />
      ) : null}
      <BottomView
        torchable={torchable}
        comfirmable={comfirmable}
        switchable={switchable}
        switchText={deviceText}
        torchOn={torchOn}
        onTorchOnChange={setTorchOn}
        onConfirmPress={onConfirmPress}
        onSwitchPress={nextDevice}
      />
      <TitleBar onBackPress={() => navigation.goBack()} />
    </SafeAreaView>
  )
}

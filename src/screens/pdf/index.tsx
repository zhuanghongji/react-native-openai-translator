import { TitleBar } from '../../components/TitleBar'
import { print } from '../../printer'
import { stylez } from '../../res/stylez'
import { toast } from '../../toast'
import type { RootStackParamList } from '../screens'
import { PDFIndicator, PDFIndicatorHandle } from './PDFIndicator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef } from 'react'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'PDF'>

export function PDFScreen({ navigation, route }: Props): JSX.Element {
  const { title, url } = route.params

  const pdfRef = useRef<Pdf>(null)
  const indicatorRef = useRef<PDFIndicatorHandle>(null)

  return (
    <SafeAreaView style={stylez.f1} edges={['bottom']}>
      <TitleBar title={title} />
      <View style={stylez.f1}>
        <Pdf
          ref={pdfRef}
          style={stylez.f1}
          source={{ uri: url, cache: true }}
          renderActivityIndicator={() => <View />}
          onLoadProgress={value => {
            // print('onLoadProgress', { value })
            indicatorRef.current?.updatePropgress(value)
          }}
          onLoadComplete={(numberOfPages, filePath, size, tableContents) => {
            print('onLoadComplete', { numberOfPages, filePath, size, tableContents })
            indicatorRef.current?.updatePropgress(1.0)
          }}
          onPageChanged={(page, numberOfPages) => {
            print('onPageChanged', { page, numberOfPages })
          }}
          onError={e => {
            toast('danger', 'Load PDF error', JSON.stringify(e))
          }}
          onPressLink={link => {
            navigation.push('Web', { title: '', url: link })
          }}
        />
        <PDFIndicator ref={indicatorRef} />
      </View>
    </SafeAreaView>
  )
}

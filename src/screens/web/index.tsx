import { TitleBar } from '../../components/TitleBar'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { toast } from '../../toast'
import type { RootStackParamList } from '../screens'
import { WebActionsModal, WebActionsModalHandle } from './WebActionsModal'
import { WebIndicator, WebIndicatorHandle } from './WebIndicator'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import Clipboard from '@react-native-clipboard/clipboard'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

type Props = NativeStackScreenProps<RootStackParamList, 'Web'>

export function WebScreen({ navigation, route }: Props): JSX.Element {
  const { title: initialTitle, url: initialUrl } = route.params

  const { t } = useTranslation()

  const webViewRef = useRef<WebView>(null)
  const indicatorRef = useRef<WebIndicatorHandle>(null)
  const actionsModalRef = useRef<WebActionsModalHandle>(null)

  const [currentTitle, _setCurrentTitle] = useState(initialTitle)
  const updateCurrentTitle = (title: string) => {
    if (title.startsWith('http')) {
      _setCurrentTitle('')
      return
    }
    _setCurrentTitle(title)
  }

  const [currentCanGoBack, setCurrentCanGoBack] = useState(false)

  const currentUrlRef = useRef(initialUrl)
  const onCpoyUrlPress = () => {
    Clipboard.setString(currentUrlRef.current)
    toast('success', t('Copied to clipboard'), currentUrlRef.current)
  }

  const onRefreshPress = () => {
    indicatorRef.current?.updatePropgress(0)
    webViewRef.current?.reload()
  }

  const onOpenInBrowserPress = () => {
    setTimeout(() => {
      Linking.openURL(currentUrlRef.current)
    }, 300)
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <TitleBar
          title={currentTitle}
          closeHidden={!currentCanGoBack}
          titleContainerNarrow={true}
          action={{
            iconName: 'more',
            iconSize: dimensions.iconLarge,
            onPress: () => actionsModalRef.current?.show(),
          }}
          onBackPress={() => {
            if (currentCanGoBack) {
              webViewRef.current?.goBack()
              return
            }
            navigation.goBack()
          }}
          onClosePress={() => navigation.goBack()}
        />
        <View style={stylez.wh100} collapsable={false}>
          <WebView
            ref={webViewRef}
            style={stylez.wh100}
            containerStyle={stylez.wh100}
            source={{ uri: initialUrl }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            domStorageEnabled={true}
            onLoadStart={e => {
              // print('onLoadStart', e.nativeEvent)
              const { canGoBack } = e.nativeEvent
              setCurrentCanGoBack(canGoBack)
            }}
            onLoadProgress={e => {
              // print('onLoadProgress', e.nativeEvent)
              const { progress, canGoBack } = e.nativeEvent
              setCurrentCanGoBack(canGoBack)
              indicatorRef.current?.updatePropgress(progress)
            }}
            onLoad={e => {
              // print('onLoad', e.nativeEvent)
              const { title, url, canGoBack } = e.nativeEvent
              updateCurrentTitle(title)
              setCurrentCanGoBack(canGoBack)
              currentUrlRef.current = url
              indicatorRef.current?.updatePropgress(1.0)
            }}
            onNavigationStateChange={e => {
              const { url } = e
              currentUrlRef.current = url

              // TODO Support use pdf-screen viewer
              // if (url.endsWith('.pdf') || url.endsWith('.PDF')) {
              //   navigation.push('PDF', { url: request.url, title: request.title ?? '' })
              //   return false
              // }

              return true
            }}
          />
          <WebIndicator ref={indicatorRef} />
          <WebActionsModal
            ref={actionsModalRef}
            onCopyUrlPress={onCpoyUrlPress}
            onRefreshPress={onRefreshPress}
            onOpenInBrowserPress={onOpenInBrowserPress}
          />
        </View>
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

import { PickModal } from '../../components/PickModal'
import { TText } from '../../components/TText'
import { usePickModalState } from '../../hooks'
import { dimensions } from '../../res/dimensions'
import { LANGUAGE_KEYS, LanguageKey } from '../../res/langs'
import {
  API_MODALS,
  ApiModal,
  LANGUAGE_MODES,
  LanguageMode,
  SERVICE_PROVIDERS,
  ServiceProvider,
  THEME_MODES,
  TRANSLATE_MODES,
  ThemeMode,
  TranslateMode,
} from '../../res/settings'
import { useTextThemeColor, useViewThemeColor } from '../../themes/hooks'
import { CheckView } from './CheckView'
import { InputView } from './InputView'
import { PickView } from './PickView'
import { TitleBar } from './TitleBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const DIVIDER_HEIGHT = 20

export function SettingsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'Settings'>
): JSX.Element {
  const { navigation } = props

  const { bottom: bottomInset } = useSafeAreaInsets()
  const contentColor = useTextThemeColor('content')
  const backgroundColor = useViewThemeColor('background')

  const [
    serviceProvider,
    setServiceProvider,
    serviceProviderAnimatedIndex,
    serviceProviderModalRef,
  ] = usePickModalState<ServiceProvider>('OpenAI')

  const [apiModal, setApiModal, apiModalAnimatedIndex, apiModalModalRef] =
    usePickModalState<ApiModal>('gpt-3.5-turbo')

  const [
    translateMode,
    setTranslateMode,
    translateModeAnimatedIndex,
    translateModeModalRef,
  ] = usePickModalState<TranslateMode>('translate')

  const [
    defaultTargetLang,
    setDefaultTargetLang,
    defaultTargetLangAnimatedIndex,
    defaultTargetLangModalRef,
  ] = usePickModalState<LanguageKey>('zh-Hans')

  const [themeMode, setThemeMode, themeModeAnimatedIndex, themeModeModalRef] =
    usePickModalState<ThemeMode>('system')

  const [langMode, setLangMode, langModeAnimatedIndex, langModeModalRef] =
    usePickModalState<LanguageMode>('en')

  const modals = (
    <>
      <PickModal
        ref={serviceProviderModalRef}
        value={serviceProvider}
        values={SERVICE_PROVIDERS}
        animatedIndex={serviceProviderAnimatedIndex}
        valueToString={v => `${v}`}
        onValueChange={setServiceProvider}
      />
      <PickModal
        ref={apiModalModalRef}
        value={apiModal}
        values={API_MODALS}
        animatedIndex={apiModalAnimatedIndex}
        valueToString={v => `${v}`}
        onValueChange={setApiModal}
      />
      <PickModal
        ref={translateModeModalRef}
        value={translateMode}
        values={TRANSLATE_MODES}
        animatedIndex={translateModeAnimatedIndex}
        valueToString={v => `${v}`}
        onValueChange={setTranslateMode}
      />
      <PickModal
        ref={defaultTargetLangModalRef}
        value={defaultTargetLang}
        values={LANGUAGE_KEYS}
        animatedIndex={defaultTargetLangAnimatedIndex}
        valueToString={v => `${v}`}
        onValueChange={setDefaultTargetLang}
      />
      <PickModal
        ref={themeModeModalRef}
        value={themeMode}
        values={THEME_MODES}
        animatedIndex={themeModeAnimatedIndex}
        valueToString={v => `${v}`}
        onValueChange={setThemeMode}
      />
      <PickModal
        ref={langModeModalRef}
        value={langMode}
        values={LANGUAGE_MODES}
        animatedIndex={langModeAnimatedIndex}
        valueToString={v => `${v}`}
        onValueChange={setLangMode}
      />
    </>
  )

  const divider = <View style={{ height: DIVIDER_HEIGHT }} />
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }]} edges={['bottom']}>
      <TitleBar onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: dimensions.edge,
          paddingTop: DIVIDER_HEIGHT,
          paddingBottom: DIVIDER_HEIGHT * 3 + bottomInset,
        }}>
        <TText style={styles.title} type="text">
          Default Service Provider
        </TText>
        <PickView
          text={serviceProvider}
          animatedIndex={serviceProviderAnimatedIndex}
          pickModalRef={serviceProviderModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          * API Key
        </TText>
        <InputView securable={true} value={'ABC'} onChangeText={() => {}} />
        <Text style={[styles.caption, { color: contentColor }]}>
          <Text>{'Go to the '}</Text>
          <Text
            style={{ color: '#1E90FF', textDecorationLine: 'underline' }}
            onPress={() => {
              Linking.openURL('https://platform.openai.com/account/api-keys')
            }}>
            {'OpenAI Page'}
          </Text>
          <Text>
            {
              ' to get your API Key. You can separate multiple API Keys with English commas to achieve quota doubling and load balancing.'
            }
          </Text>
        </Text>

        {divider}
        <TText style={styles.title} type="text">
          API Model
        </TText>
        <PickView
          text={apiModal}
          animatedIndex={apiModalAnimatedIndex}
          pickModalRef={apiModalModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          API URL
        </TText>
        <InputView value={'ABC'} onChangeText={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          API URL Path
        </TText>
        <InputView value={'ABC'} onChangeText={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          Default Translate Mode
        </TText>
        <PickView
          text={translateMode}
          animatedIndex={translateModeAnimatedIndex}
          pickModalRef={translateModeModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          Default Target Language
        </TText>
        <PickView
          text={defaultTargetLang}
          animatedIndex={defaultTargetLangAnimatedIndex}
          pickModalRef={defaultTargetLangModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          Theme
        </TText>
        <PickView
          text={themeMode}
          animatedIndex={themeModeAnimatedIndex}
          pickModalRef={themeModeModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          Language
        </TText>
        <PickView
          text={langMode}
          animatedIndex={langModeAnimatedIndex}
          pickModalRef={langModeModalRef}
        />

        {divider}
        <CheckView
          title="Always show icons"
          value={false}
          onValueChange={() => {}}
        />

        {divider}
        <CheckView
          title="Auto Translate"
          value={false}
          onValueChange={() => {}}
        />

        {divider}
        <CheckView
          title="Restore Previous Position"
          value={false}
          onValueChange={() => {}}
        />
      </ScrollView>

      {modals}
    </SafeAreaView>
  )
}

type Styles = {
  title: TextStyle
  caption: TextStyle
}

const styles = StyleSheet.create<Styles>({
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  caption: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
    textAlign: 'justify',
    marginHorizontal: 2,
  },
})

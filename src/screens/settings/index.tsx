import { PickModal } from '../../components/PickModal'
import { TText } from '../../components/TText'
import { usePickModal } from '../../hooks'
import {
  API_MODELS,
  LANGUAGE_KEYS,
  LANGUAGE_MODES,
  SERVICE_PROVIDERS,
  THEME_MODES,
  TRANSLATE_MODES,
  languageLabelByKey,
} from '../../preferences/options'
import {
  useApiKeyPref,
  useApiModelPref,
  useApiUrlPathPref,
  useApiUrlPref,
  useDefaultTargetLanguagePref,
  useDefaultTranslateModePref,
  useLanguageModePref,
  useServiceProviderPref,
  useThemeModePref,
} from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useTextThemeColor, useViewThemeColor } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
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

  const [serviceProviderAnimatedIndex, serviceProviderModalRef] = usePickModal()
  const [serviceProvider, setServiceProvider] = useServiceProviderPref()

  const [apiKey, setApiKey] = useApiKeyPref()

  const [apiModelAnimatedIndex, apiModelModalRef] = usePickModal()
  const [apiModel, setApiModel] = useApiModelPref()

  const [apiUrl, setApiUrl] = useApiUrlPref()
  const [apiUrlPath, setApiUrlPath] = useApiUrlPathPref()

  const [defaultTranslateModeAnimatedIndex, defaultTranslateModeModalRef] =
    usePickModal()
  const [defaultTranslateMode, setDefaultTranslateMode] =
    useDefaultTranslateModePref()

  const [defaultTargetLangAnimatedIndex, defaultTargetLangModalRef] =
    usePickModal()
  const [defaultTargetLang, setDefaultTargetLang] =
    useDefaultTargetLanguagePref()
  const defaultTargetLangLabel = languageLabelByKey(defaultTargetLang)

  const [themeModeAnimatedIndex, themeModeModalRef] = usePickModal()
  const [themeMode, setThemeMode] = useThemeModePref()

  const [langModeAnimatedIndex, langModeModalRef] = usePickModal()
  const [langMode, setLangMode] = useLanguageModePref()
  const langeModeLabel = languageLabelByKey(langMode)

  const modals = (
    <>
      <PickModal
        ref={serviceProviderModalRef}
        value={serviceProvider}
        values={SERVICE_PROVIDERS}
        animatedIndex={serviceProviderAnimatedIndex}
        valueToLabel={v => `${v}`}
        onValueChange={setServiceProvider}
      />
      <PickModal
        ref={apiModelModalRef}
        value={apiModel}
        values={API_MODELS}
        animatedIndex={apiModelAnimatedIndex}
        onValueChange={setApiModel}
      />
      <PickModal
        ref={defaultTranslateModeModalRef}
        value={defaultTranslateMode}
        values={TRANSLATE_MODES}
        animatedIndex={defaultTranslateModeAnimatedIndex}
        onValueChange={setDefaultTranslateMode}
      />
      <PickModal
        ref={defaultTargetLangModalRef}
        value={defaultTargetLang}
        values={LANGUAGE_KEYS}
        animatedIndex={defaultTargetLangAnimatedIndex}
        valueToLabel={languageLabelByKey}
        onValueChange={setDefaultTargetLang}
      />
      <PickModal
        ref={themeModeModalRef}
        value={themeMode}
        values={THEME_MODES}
        animatedIndex={themeModeAnimatedIndex}
        onValueChange={setThemeMode}
      />
      <PickModal
        ref={langModeModalRef}
        value={langMode}
        values={LANGUAGE_MODES}
        animatedIndex={langModeAnimatedIndex}
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
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: dimensions.edge,
          paddingTop: DIVIDER_HEIGHT,
          paddingBottom: DIVIDER_HEIGHT * 3 + bottomInset,
        }}>
        <TText style={styles.title} type="text">
          Default Service Provider
        </TText>
        <PickView
          label={serviceProvider}
          animatedIndex={serviceProviderAnimatedIndex}
          pickModalRef={serviceProviderModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          * API Key
        </TText>
        <InputView securable={true} value={apiKey} onChangeText={setApiKey} />
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
          label={apiModel}
          animatedIndex={apiModelAnimatedIndex}
          pickModalRef={apiModelModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          API URL
        </TText>
        <InputView value={apiUrl} onChangeText={setApiUrl} />

        {divider}
        <TText style={styles.title} type="text">
          API URL Path
        </TText>
        <InputView value={apiUrlPath} onChangeText={setApiUrlPath} />

        {divider}
        <TText style={styles.title} type="text">
          Default Translate Mode
        </TText>
        <PickView
          label={defaultTranslateMode}
          animatedIndex={defaultTranslateModeAnimatedIndex}
          pickModalRef={defaultTranslateModeModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          Default Target Language
        </TText>
        <PickView
          label={defaultTargetLangLabel}
          animatedIndex={defaultTargetLangAnimatedIndex}
          pickModalRef={defaultTargetLangModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          Theme
        </TText>
        <PickView
          label={themeMode}
          animatedIndex={themeModeAnimatedIndex}
          pickModalRef={themeModeModalRef}
        />

        {divider}
        <TText style={styles.title} type="text">
          Language
        </TText>
        <PickView
          label={langeModeLabel}
          animatedIndex={langModeAnimatedIndex}
          pickModalRef={langModeModalRef}
        />

        {/* {divider}
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
        /> */}
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

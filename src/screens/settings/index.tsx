import { PickSelector } from '../../components/PickSelector'
import { TText } from '../../components/TText'
import {
  API_MODELS,
  LANGUAGE_KEYS,
  LANGUAGE_MODES,
  SERVICE_PROVIDERS,
  THEME_MODES,
  TRANSLATOR_MODES,
  languageLabelByKey,
} from '../../preferences/options'
import {
  useApiKeyPref,
  useApiModelPref,
  useApiUrlPathPref,
  useApiUrlPref,
  useDefaultTargetLanguagePref,
  useDefaultTranslatorModePref,
  useLanguageModePref,
  useServiceProviderPref,
  useThemeModePref,
} from '../../preferences/storages'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { InputView } from './InputView'
import { PickView } from './PickView'
import { TitleBar } from './TitleBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const DIVIDER_HEIGHT = 20

export function SettingsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'Settings'>
): JSX.Element {
  const { navigation } = props

  const { bottom: bottomInset } = useSafeAreaInsets()
  const contentColor = useThemeColor('text2')
  const backgroundColor = useThemeColor('background')

  const [serviceProvider, setServiceProvider] = useServiceProviderPref()
  const [apiKey, setApiKey] = useApiKeyPref()
  const [apiModel, setApiModel] = useApiModelPref()
  const [apiUrl, setApiUrl] = useApiUrlPref()
  const [apiUrlPath, setApiUrlPath] = useApiUrlPathPref()
  const [defaultTranslatorMode, setDefaultTranslatorMode] = useDefaultTranslatorModePref()
  const [defaultTargetLang, setDefaultTargetLang] = useDefaultTargetLanguagePref()
  const [themeMode, setThemeMode] = useThemeModePref()
  const [langMode, setLangMode] = useLanguageModePref()

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
        <TText style={styles.title} typo="text">
          Default Service Provider
        </TText>
        <PickSelector
          style={styles.pick}
          value={serviceProvider}
          values={SERVICE_PROVIDERS}
          valueToLabel={v => `${v}`}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setServiceProvider}
        />

        {divider}
        <TText style={styles.title} typo="text">
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
        <TText style={styles.title} typo="text">
          API Model
        </TText>
        <PickSelector
          style={styles.pick}
          value={apiModel}
          values={API_MODELS}
          valueToLabel={v => `${v}`}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setApiModel}
        />

        {divider}
        <TText style={styles.title} typo="text">
          API URL
        </TText>
        <InputView value={apiUrl} onChangeText={setApiUrl} />

        {divider}
        <TText style={styles.title} typo="text">
          API URL Path
        </TText>
        <InputView value={apiUrlPath} onChangeText={setApiUrlPath} />

        {divider}
        <TText style={styles.title} typo="text">
          Default Translate Mode
        </TText>
        <PickSelector
          style={styles.pick}
          value={defaultTranslatorMode}
          values={TRANSLATOR_MODES}
          valueToLabel={v => `${v}`}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setDefaultTranslatorMode}
        />

        {divider}
        <TText style={styles.title} typo="text">
          Default Target Language
        </TText>
        <PickSelector
          style={styles.pick}
          value={defaultTargetLang}
          values={LANGUAGE_KEYS}
          valueToLabel={languageLabelByKey}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setDefaultTargetLang}
        />

        {divider}
        <TText style={styles.title} typo="text">
          Theme
        </TText>
        <PickSelector
          value={themeMode}
          values={THEME_MODES}
          valueToLabel={v => `${v}`}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setThemeMode}
        />

        {divider}
        <TText style={styles.title} typo="text">
          Language
        </TText>
        <PickSelector
          style={styles.pick}
          value={langMode}
          values={LANGUAGE_MODES}
          valueToLabel={languageLabelByKey}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setLangMode}
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
    </SafeAreaView>
  )
}

type Styles = {
  title: TextStyle
  caption: TextStyle
  pick: ViewStyle
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
  pick: {
    marginTop: 6,
  },
})

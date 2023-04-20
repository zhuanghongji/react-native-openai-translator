import { ConfirmModal } from '../../components/ConfirmModal'
import { PickSelector } from '../../components/PickSelector'
import { TText } from '../../components/TText'
import { DEFAULTS } from '../../preferences/defaults'
import {
  API_MODELS,
  LANGUAGE_KEYS,
  LANGUAGE_MODES,
  SERVICE_PROVIDERS,
  THEME_MODES,
  TRANSLATOR_MODES,
  languageLabelByKey,
  useThemeModeLabelFn,
  useTranslatorModeLabelFn,
} from '../../preferences/options'
import {
  useApiKeyPref,
  useApiModelPref,
  useApiUrlPathPref,
  useApiUrlPref,
  useDefaultTargetLanguagePref,
  useDefaultTranslatorModePref,
  useEnableClipboardDetectPref,
  useLanguageModePref,
  useServiceProviderPref,
  useThemeModePref,
} from '../../preferences/storages'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { CheckView } from './CheckView'
import { InputView } from './InputView'
import { PickView } from './PickView'
import { RepoLinks } from './RepoLinks'
import { TitleBar } from './TitleBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const [enableClipboardDetect, setEnableClipboardDetect] = useEnableClipboardDetectPref()

  const [resetConfirmModalVisible, setResetConfirmModalVisible] = useState(false)

  const { t, i18n } = useTranslation()
  const translatorModeLabelFn = useTranslatorModeLabelFn()
  const themeModeLabelFn = useThemeModeLabelFn()

  const divider = <View style={{ height: DIVIDER_HEIGHT }} />

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }]} edges={['bottom']}>
      <TitleBar
        onBackPress={() => navigation.goBack()}
        onResetPress={() => setResetConfirmModalVisible(true)}
      />
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
          {t('Service Provider')}
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
          <Text>{t('API Key')}</Text>
          <Text style={{ color: colors.warning }}>{' *'}</Text>
        </TText>
        <InputView
          securable={true}
          value={apiKey}
          modalTitle={t('API Key')}
          onChangeText={setApiKey}
        />
        <Text style={[styles.caption, { color: contentColor }]}>
          <Text>{t('Go to the ')}</Text>
          <Text
            style={styles.link}
            onPress={() => {
              Linking.openURL('https://platform.openai.com/account/api-keys')
            }}>
            {'OpenAI Page'}
          </Text>
          <Text>
            {t(
              ' to get your API Key. You can separate multiple API Keys with English commas to achieve quota doubling and load balancing.'
            )}
          </Text>
        </Text>

        {divider}
        <TText style={styles.title} typo="text">
          {t('API Model')}
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
          {t('API URL')}
        </TText>
        <InputView value={apiUrl} modalTitle={t('API URL')} onChangeText={setApiUrl} />

        {divider}
        <TText style={styles.title} typo="text">
          {t('API URL Path')}
        </TText>
        <InputView value={apiUrlPath} modalTitle={t('API URL Path')} onChangeText={setApiUrlPath} />

        {divider}
        <TText style={styles.title} typo="text">
          {t('Default Translator Mode')}
        </TText>
        <PickSelector
          style={styles.pick}
          value={defaultTranslatorMode}
          values={TRANSLATOR_MODES}
          valueToLabel={translatorModeLabelFn}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setDefaultTranslatorMode}
        />

        {divider}
        <TText style={styles.title} typo="text">
          {t('Default Target Language')}
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
          {t('Theme')}
        </TText>
        <PickSelector
          style={styles.pick}
          value={themeMode}
          values={THEME_MODES}
          valueToLabel={themeModeLabelFn}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={setThemeMode}
        />

        {divider}
        <TText style={styles.title} typo="text">
          {t('Language')}
        </TText>
        <PickSelector
          style={styles.pick}
          value={langMode}
          values={LANGUAGE_MODES}
          valueToLabel={languageLabelByKey}
          renderContent={({ label, anim }) => <PickView label={label} anim={anim} />}
          onValueChange={lang => {
            setLangMode(lang)
            i18n.changeLanguage(lang)
          }}
        />

        {divider}
        <CheckView
          title={t('Enable Clipboard Detect')}
          value={enableClipboardDetect}
          onValueChange={setEnableClipboardDetect}
        />

        <RepoLinks />
      </ScrollView>

      <ConfirmModal
        visible={resetConfirmModalVisible}
        message={t('Are you sure to reset all settings except for the API Key ?')}
        leftText={t('CANCEL')}
        rightText={t('RESET')}
        onRightPress={() => {
          setServiceProvider(DEFAULTS.serviceProvider)
          setApiModel(DEFAULTS.apiModel)
          setApiUrl(DEFAULTS.apiUrl)
          setApiUrlPath(DEFAULTS.apiUrlPath)
          setDefaultTargetLang(DEFAULTS.defaultTargetLanguage)
          setThemeMode(DEFAULTS.themeMode)
          setLangMode(DEFAULTS.languageMode)
          i18n.changeLanguage(DEFAULTS.languageMode)
        }}
        onDismissRequest={setResetConfirmModalVisible}
      />
    </SafeAreaView>
  )
}

type Styles = {
  title: TextStyle
  caption: TextStyle
  pick: ViewStyle
  link: TextStyle
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
  link: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
})

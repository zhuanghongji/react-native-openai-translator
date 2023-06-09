import { Divider } from '../../../components/Divider'
import { SvgIconName } from '../../../components/SvgIcon'
import { TCustomChatBasic, TCustomChatDefault } from '../../../db/types'
import { stylez } from '../../../res/stylez'
import { useThemeScheme } from '../../../themes/hooks'
import { ClearMessagesDetailView } from './ClearMessagesDetailView'
import { EditAvatarDetailView } from './EditAvatarDetailView'
import { EditChatNameDetialView } from './EditChatNameDetialView'
import { EditContextMessageNumDetailView } from './EditContextMessageNumDetailView'
import { EditFontSizeDetailView } from './EditFontSizeDetailView'
import { EditModelDetailView } from './EditModelDetailView'
import { EditSystemPromptDetailView } from './EditSystemPromptDetailView'
import { EditTemperatureValueDetailView } from './EditTemperatureValueDetailView'
import { SettingsDetailContainer } from './SettingsDetailContainer'
import { SettingsItemView } from './SettingsItemView'
import { SettingsSelectorProvider } from './SettingsSelectorProvider'
import { SettingsTitleBar } from './SettingsTitleBar'
import { ShareConfigDetailView } from './ShareConfigsDetailView'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

type Item = {
  title: string
  subtitle?: string
  iconName?: SvgIconName
}

export type SettingsSelectorModalProps = {
  style?: StyleProp<ViewStyle>
  settings: TCustomChatDefault
  onSettingsChange: (values: Partial<TCustomChatBasic>) => void
  onClearMessagesConfirmed: () => void
  onShow: () => void
  onDismiss: () => void
}

export type SettingsSelectorModalHandle = {
  show: () => void
}

export const SettingsSelectorModal = React.forwardRef<
  SettingsSelectorModalHandle,
  SettingsSelectorModalProps
>((props, ref) => {
  const { style, settings, onSettingsChange, onClearMessagesConfirmed, onShow, onDismiss } = props
  const { avatar, chat_name, system_prompt, model, temperature, context_messages_num, font_size } =
    settings

  const { t } = useTranslation()
  const { backgroundModal: backgroundColor } = useThemeScheme()

  const { width: frameWidth } = useSafeAreaFrame()

  const selectorModalRef = useRef<BottomSheetModal>(null)

  const selectorPoints = useMemo(() => ['70%'], [])
  const [isInSelector, setIsInSelector] = useState(true)
  const onBackNotify = useCallback(() => {
    setIsInSelector(true)
  }, [])
  const onSelectedNotify = useCallback(() => {
    setIsInSelector(false)
  }, [])

  const items: Item[] = [
    { title: t('Avatar'), subtitle: avatar },
    { title: t('Chat Name') },
    { title: t('System Prompt') },
    {
      title: t('Font Size'),
      subtitle: `${font_size} ${Platform.OS === 'ios' ? 'pt' : 'dp'}`,
      iconName: 'font-size',
    },
    { title: t('Model'), subtitle: model, iconName: 'model' },
    { title: t('Temperature Value'), subtitle: `${temperature}`, iconName: 'thermostat' },
    {
      title: t('Context Messages Number'),
      subtitle: `${context_messages_num}`,
      iconName: 'history',
    },
    { title: t('Clear Messages'), iconName: 'delete' },
    { title: t('Share Configs'), iconName: 'share' },
  ]
  useImperativeHandle(ref, () => ({
    show: () => {
      selectorModalRef.current?.present()
    },
  }))

  const renderBackdrop = useCallback(
    (os: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...os}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={isInSelector ? 'close' : 'none'}
      />
    ),
    [isInSelector]
  )

  return (
    <BottomSheetModal
      ref={selectorModalRef}
      style={[stylez.modal, style]}
      backgroundStyle={{ backgroundColor }}
      index={0}
      snapPoints={selectorPoints}
      stackBehavior="push"
      handleComponent={null}
      keyboardBehavior="extend"
      enableContentPanningGesture={isInSelector}
      backdropComponent={renderBackdrop}
      onChange={index => (index === -1 ? onDismiss() : onShow())}>
      <SettingsSelectorProvider>
        <View style={[stylez.f1, { width: frameWidth }]}>
          <SettingsTitleBar backHidden actionHidden title={t('Chat Configs')} />
          <BottomSheetFlatList
            style={{ width: frameWidth }}
            data={items}
            keyExtractor={(item, index) => `${index}_${item.title}`}
            renderItem={({ item, index }) => {
              const { title, subtitle, iconName } = item
              return (
                <SettingsItemView
                  index={index}
                  title={title}
                  subtitle={subtitle}
                  iconName={iconName}
                  onSelectedNotify={onSelectedNotify}
                />
              )
            }}
            ListHeaderComponent={Divider}
            ItemSeparatorComponent={Divider}
            ListFooterComponent={Divider}
          />

          <SettingsDetailContainer index={0}>
            <EditAvatarDetailView
              value={avatar}
              onValueChange={value => onSettingsChange({ avatar: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={1}>
            <EditChatNameDetialView
              value={chat_name}
              fontSize={font_size}
              onValueChange={value => onSettingsChange({ chat_name: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={2}>
            <EditSystemPromptDetailView
              value={system_prompt}
              fontSize={font_size}
              onValueChange={value => onSettingsChange({ system_prompt: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={3}>
            <EditFontSizeDetailView
              value={font_size}
              onValueChange={value => onSettingsChange({ font_size: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={4}>
            <EditModelDetailView
              value={model}
              onValueChange={value => onSettingsChange({ model: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={5}>
            <EditTemperatureValueDetailView
              value={temperature}
              onValueChange={value => onSettingsChange({ temperature: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={6}>
            <EditContextMessageNumDetailView
              value={context_messages_num}
              onValueChange={value => onSettingsChange({ context_messages_num: value })}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={7}>
            <ClearMessagesDetailView
              onConfirmPress={onClearMessagesConfirmed}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={8}>
            <ShareConfigDetailView settings={settings} onBackNotify={onBackNotify} />
          </SettingsDetailContainer>
        </View>
      </SettingsSelectorProvider>
    </BottomSheetModal>
  )
})

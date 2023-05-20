import { Divider } from '../../../components/Divider'
import { TCustomChatBasic, TCustomChatDefault } from '../../../db/types'
import { DeleteAllMessagesDetailView } from './DeleteAllMessagesDetailView'
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
import { ShareDetailView } from './ShareDetailView'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

type Item = {
  title: string
}

export type SettingsSelectorModalProps = {
  style?: StyleProp<ViewStyle>
  settings: TCustomChatDefault
  onSettingsChange: (values: Partial<TCustomChatBasic>) => void
  onDeleteAllMessageConfirm: () => void
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
  const { style, settings, onSettingsChange, onDeleteAllMessageConfirm, onShow, onDismiss } = props
  const { avatar, chat_name, system_prompt, model, temperature, context_messages_num, font_size } =
    settings

  const { width: frameWidth } = useSafeAreaFrame()

  const selectorModalRef = useRef<BottomSheetModal>(null)

  const selectorPoints = useMemo(() => ['60%', '80%'], [])
  const [snapIndex, setSnapIndex] = useState<0 | 1>(0)
  const [isInSelector, setIsInSelector] = useState(true)
  const onBackNotify = useCallback(() => {
    setSnapIndex(0)
    setIsInSelector(true)
  }, [])
  const onSelectedNotify = useCallback((index: number) => {
    if (index === 2) {
      setSnapIndex(1)
    }
    setIsInSelector(false)
  }, [])

  const items: Item[] = [
    { title: '修改头像' },
    { title: '修改对话名称' },
    { title: '修改系统提示' },
    { title: '字号' },
    { title: '模型' },
    { title: '温度值' },
    { title: '上下文消息个数' },
    { title: '删除全部消息' },
    { title: '分享' },
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
      style={style}
      index={snapIndex}
      snapPoints={selectorPoints}
      stackBehavior="push"
      handleComponent={null}
      enableContentPanningGesture={isInSelector}
      backdropComponent={renderBackdrop}
      onChange={index => {
        // print('onChange', { index })
        index === -1 ? onDismiss() : onShow()
      }}>
      <SettingsSelectorProvider>
        <View style={[styles.content, { width: frameWidth }]}>
          <SettingsTitleBar backHidden actionHidden title="Chat Settings" />
          <BottomSheetFlatList
            style={{ width: frameWidth }}
            data={items}
            keyExtractor={(item, index) => `${index}_${item.title}`}
            renderItem={({ item, index }) => {
              const { title } = item
              return (
                <SettingsItemView index={index} title={title} onSelectedNotify={onSelectedNotify} />
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
            <DeleteAllMessagesDetailView
              onConfirmPress={onDeleteAllMessageConfirm}
              onBackNotify={onBackNotify}
            />
          </SettingsDetailContainer>

          <SettingsDetailContainer index={8}>
            <ShareDetailView onBackNotify={onBackNotify} />
          </SettingsDetailContainer>
        </View>
      </SettingsSelectorProvider>
    </BottomSheetModal>
  )
})

type Styles = {
  content: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  content: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
})

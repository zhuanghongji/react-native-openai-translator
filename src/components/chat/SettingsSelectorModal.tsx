import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeSelector } from '../../themes/hooks'
import { Divider } from '../Divider'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type SettingsSelectorModalProps = {
  style?: StyleProp<ViewStyle>
}

export type SettingsSelectorModalHandle = {
  show: () => void
}

export const SettingsSelectorModal = React.forwardRef<
  SettingsSelectorModalHandle,
  SettingsSelectorModalProps
>((props, ref) => {
  const { style } = props

  const color = useThemeSelector(colors.white, colors.black)

  const selectorModalRef = useRef<BottomSheetModal>(null)

  const avatarModalRef = useRef<BottomSheetModal>(null)
  const chatNameModalRef = useRef<BottomSheetModal>(null)
  const systemPromptModalRef = useRef<BottomSheetModal>(null)
  const fontSizeModalRef = useRef<BottomSheetModal>(null)
  const modelModalRef = useRef<BottomSheetModal>(null)
  const temperatureModalRef = useRef<BottomSheetModal>(null)
  const contextNumModalRef = useRef<BottomSheetModal>(null)
  const clearMessageModalRef = useRef<BottomSheetModal>(null)
  const shareModalRef = useRef<BottomSheetModal>(null)

  const selectorPoints = useMemo(() => ['60%'], [])
  const detailPoints = useMemo(() => ['50%'], [])

  const renderBackdrop = useCallback(
    (os: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...os} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  )

  useImperativeHandle(ref, () => ({
    show: () => {
      selectorModalRef.current?.present()
    },
  }))

  const renderSelectorItem = (options: {
    title: string
    modalRef: React.RefObject<BottomSheetModalMethods>
  }) => {
    const { title, modalRef } = options
    return (
      <>
        <Pressable
          style={styles.item}
          onPress={() => {
            modalRef.current?.present()
          }}>
          <Text style={[styles.title, { color }]}>{title}</Text>
        </Pressable>
        <Divider />
      </>
    )
  }

  return (
    <>
      {/* Selector */}
      <BottomSheetModal
        ref={selectorModalRef}
        index={0}
        snapPoints={selectorPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <BottomSheetScrollView style={styles.container}>
          <Divider />
          {renderSelectorItem({
            title: '修改头像',
            modalRef: avatarModalRef,
          })}
          {renderSelectorItem({
            title: '修改对话名称',
            modalRef: chatNameModalRef,
          })}
          {renderSelectorItem({
            title: '修改系统提示',
            modalRef: systemPromptModalRef,
          })}
          {renderSelectorItem({
            title: '字号',
            modalRef: fontSizeModalRef,
          })}
          {renderSelectorItem({
            title: '模型',
            modalRef: modelModalRef,
          })}
          {renderSelectorItem({
            title: '温度值',
            modalRef: temperatureModalRef,
          })}
          {renderSelectorItem({
            title: '上下文消息个数',
            modalRef: contextNumModalRef,
          })}
          {renderSelectorItem({
            title: '删除全部消息',
            modalRef: clearMessageModalRef,
          })}
          {renderSelectorItem({
            title: '分享',
            modalRef: shareModalRef,
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Edit Avatar */}
      <BottomSheetModal
        ref={avatarModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>修改头像</Text>
        </View>
      </BottomSheetModal>

      {/* Edit Chat Name */}
      <BottomSheetModal
        ref={chatNameModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>修改对话名称</Text>
        </View>
      </BottomSheetModal>

      {/* Edit System Prompt */}
      <BottomSheetModal
        ref={systemPromptModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>修改系统提示</Text>
        </View>
      </BottomSheetModal>

      {/* Font Size */}
      <BottomSheetModal
        ref={fontSizeModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>字号</Text>
        </View>
      </BottomSheetModal>

      {/* Model */}
      <BottomSheetModal
        ref={modelModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>模型</Text>
        </View>
      </BottomSheetModal>

      {/* Temperature Value */}
      <BottomSheetModal
        ref={temperatureModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>温度值</Text>
        </View>
      </BottomSheetModal>

      {/* Context Message Num */}
      <BottomSheetModal
        ref={contextNumModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>上下文消息个数</Text>
        </View>
      </BottomSheetModal>

      {/* Clear Message */}
      <BottomSheetModal
        ref={clearMessageModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>删除全部消息</Text>
        </View>
      </BottomSheetModal>

      {/* Share */}
      <BottomSheetModal
        ref={shareModalRef}
        index={0}
        snapPoints={detailPoints}
        stackBehavior="push"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          <Text>分享</Text>
        </View>
      </BottomSheetModal>
    </>
  )
})

type Styles = {
  container: ViewStyle
  item: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    // flex: 1,
  },
  item: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    fontSize: 16,
  },
})

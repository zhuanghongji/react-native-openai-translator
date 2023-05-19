import { SettingsTitleBar } from './SettingsTitleBar'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type ShareDetailViewProps = {
  style?: StyleProp<ViewStyle>
}

export function ShareDetailView(props: ShareDetailViewProps) {
  const { style } = props

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar title="Share" />
      {/* TODO */}
    </View>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
})

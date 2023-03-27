import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { TranslateMode } from '../../res/settings'
import { useTextThemeColor, useViewThemeColor } from '../../themes/hooks'
import { TranslatorStatus } from '../../types'
import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export interface StatusDividerProps {
  mode: TranslateMode
  status: TranslatorStatus
}

export function StatusDivider(props: StatusDividerProps): JSX.Element {
  const { mode, status } = props
  const contentColor = useTextThemeColor('content')
  const backdropSecondaryColor = useViewThemeColor('backdropSecondary')
  const backdropSecondaryStyle: ViewStyle = {
    backgroundColor: backdropSecondaryColor,
  }
  return (
    <View style={styles.container}>
      <View style={[styles.divider, backdropSecondaryStyle]} />
      <View style={[styles.statusRow, backdropSecondaryStyle]}>
        <TText
          style={[styles.statusText, { color: contentColor }]}
          type="content">
          Analyzed
        </TText>
        <Text style={styles.statusEmoji}>👍</Text>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  divider: ViewStyle
  statusRow: ViewStyle
  statusText: TextStyle
  statusEmoji: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dimensions.edge,
  },
  divider: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'red',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    width: 96,
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    flex: 1,
    fontSize: 11,
  },
  statusEmoji: {
    fontSize: 11,
  },
})

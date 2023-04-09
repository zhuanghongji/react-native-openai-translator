import { AnimRotateContainer } from '../../../components/AnimRotateContainer'
import { TText } from '../../../components/TText'
import { dimensions } from '../../../res/dimensions'
import { images } from '../../../res/images'
import { sheets } from '../../../res/sheets'
import { useThemeColor } from '../../../themes/hooks'
import { trimContent } from '../../../utils'
import { useSSEMessageStore } from '../../../zustand/stores/sse-message-store'
import React from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type SSEMessageProps = {
  style?: StyleProp<ViewStyle>
}

export function SSEMessageView(props: SSEMessageProps) {
  const { style } = props

  const backgroundColor = useThemeColor('backgroundMessage')

  const status = useSSEMessageStore(state => state.status)
  const content = useSSEMessageStore(state => state.content)
  if (status !== 'sending') {
    return null
  }
  return (
    <View style={[style, styles.container]}>
      <AnimRotateContainer style={styles.imageWrapper} rotating={true}>
        <Image style={{ width: 18, height: 18 }} source={images.logoMini} />
      </AnimRotateContainer>

      <View style={[styles.content, { backgroundColor }]}>
        <TText style={[styles.text, sheets.contentText]} typo="text">
          {content ? trimContent(content) : '...'}
        </TText>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  content: ViewStyle
  imageWrapper: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: dimensions.edge,
    marginTop: dimensions.messageSeparator,
  },
  imageWrapper: {
    width: 32,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    maxWidth: '80%',
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
  },
  text: {
    textAlign: 'justify',
    textAlignVertical: 'top',
  },
})

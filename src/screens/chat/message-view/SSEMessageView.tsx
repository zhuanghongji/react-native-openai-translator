import { AnimRotateContainer } from '../../../components/AnimRotateContainer'
import { dimensions } from '../../../res/dimensions'
import { images } from '../../../res/images'
import { sheets } from '../../../res/sheets'
import { trimContent } from '../../../utils'
import { useSSEMessageStore } from '../../../zustand/stores/sse-message-store'
import React from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type SSEMessageProps = {
  style?: StyleProp<ViewStyle>
}

export function SSEMessageView(props: SSEMessageProps) {
  const { style } = props

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

      <View style={styles.content}>
        <Text style={[styles.text, sheets.contentText]}>
          {content ? trimContent(content) : '...'}
        </Text>
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
    backgroundColor: '#2C2C2C',
  },
  text: {
    textAlign: 'justify',
    color: 'white',
  },
})

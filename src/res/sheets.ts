import { StyleSheet, TextStyle } from 'react-native'

type Sheets = {
  contentText: TextStyle
}

export const sheets = StyleSheet.create<Sheets>({
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
})

import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type EmojisModalSceneProps = {
  style?: StyleProp<ViewStyle>
  itemWidth: number
  numColumns: number
  emojiList: string[]
  onEmojiPress: (value: string) => void
}

export const EmojisModalScene = React.memo((props: EmojisModalSceneProps) => {
  const { style, itemWidth, numColumns, emojiList, onEmojiPress } = props
  return (
    <BottomSheetFlatList
      style={[styles.container, style]}
      contentContainerStyle={{ paddingHorizontal: dimensions.edge }}
      data={emojiList}
      numColumns={numColumns}
      keyExtractor={(item, index) => `${index}_${item}`}
      renderItem={({ item }) => {
        return (
          <Pressable style={[styles.item, { width: itemWidth }]} onPress={() => onEmojiPress(item)}>
            <Text style={styles.text}>{item}</Text>
          </Pressable>
        )
      }}
    />
  )
})

type Styles = {
  container: ViewStyle
  item: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
  },
  item: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: colors.black,
  },
})

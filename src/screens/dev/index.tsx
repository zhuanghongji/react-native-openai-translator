import { Button } from '../../components/Button'
import { TitleBar } from '../../components/TitleBar'
import { dropTableWhenDev } from '../../db/funcs'
import { DEFAULT_T_RESULT_EXTRA } from '../../db/helper'
import { dbExecuteSql } from '../../db/manager'
import { DBTableName } from '../../db/table-names'
import { dbInsertModeResult, dbSelectModeResult } from '../../db/table/t-mode-result'
import { print } from '../../printer'
import { dimensions } from '../../res/dimensions'
import type { RootStackParamList } from '../screens'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Dev'>

export function DevScreen({ navigation: _ }: Props): JSX.Element {
  const testDB = async () => {
    try {
      const result = await dbExecuteSql({ statement: 'select * from t_test' })
      print('testDB', result)
    } catch (e) {
      print('testDB', e)
    }
  }

  useEffect(() => {
    testDB()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TitleBar title="Dev" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: dimensions.edge }}>
        <Button
          style={styles.button}
          text="Add"
          onPress={() => {
            dbExecuteSql({ statement: 'insert into t_test (done, value) values (0, ?)' })
          }}
        />
        <Button
          style={styles.button}
          text="DROP TABLE"
          onPress={() => {
            dropTableWhenDev(DBTableName.test)
            dropTableWhenDev(DBTableName.modeResult)
            dropTableWhenDev(DBTableName.modeChatMessage)
            dropTableWhenDev(DBTableName.customChat)
            dropTableWhenDev(DBTableName.customChatMessage)
          }}
        />
        <Button
          style={styles.button}
          text="PRAGMA TABLE_INFO"
          onPress={() => {
            dbExecuteSql({ statement: 'PRAGMA table_info(test) where name = value' })
              // dbExecuteSql('PRAGMA table_info(test)')
              .then(result => {
                print('pragma result =', result)
              })
              .catch(e => {
                print('pragma error = ', e)
              })
          }}
        />
        <Button
          style={styles.button}
          text="INSERT MODE_RESULT"
          onPress={() => {
            dbInsertModeResult({
              ...DEFAULT_T_RESULT_EXTRA,
              mode: 'translate',
              target_lang: 'zh-hant',
              system_prompt: 'aaa',
              user_prompt_prefix: 'bbb',
              user_prompt_suffix: 'ccc',
              user_content: 'world',
              assistant_content: '世界',
              collected: '1',
              type: '0',
              status: null,
            })
              .then(result => {
                print('dbInsertModeResult result = ', result)
              })
              .catch(e => {
                print('dbInsertModeResult error = ', e)
              })
          }}
        />
        <Button
          style={styles.button}
          text="SELECT MODE_RESULT"
          onPress={() => {
            dbSelectModeResult()
              .then(result => {
                print('dbSelectModeResult rows = ', result)
              })
              .catch(e => {
                print('dbSelectModeResult error = ', e)
              })
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

type Styles = {
  button: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  button: {
    width: '80%',
    marginHorizontal: '10%',
    marginTop: dimensions.edge,
  },
})

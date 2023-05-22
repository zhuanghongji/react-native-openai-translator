import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export const queryStorage = new MMKV({ id: 'mmkv.query' })

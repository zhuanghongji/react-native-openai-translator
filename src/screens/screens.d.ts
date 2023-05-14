import { TCustomChat } from '../db/table/t-custom-chat'
import { TModeResult } from '../db/table/t-mode-result'
import type { ScanBlock } from '../types'
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>
  Template: undefined
  Dev: undefined
  Settings: undefined
  Scanner: {
    onScanSuccess: (blocks: ScanBlock[]) => void
  }
  ModeChat: {
    modeResult: TModeResult
    systemPrompt: string
    userContent: string
    assistantContent: string
  }
  CustomChat: {
    chat: TCustomChat
  }
  CustomChatInit: undefined
  AwesomePrompts: undefined
  EnglishWordBook: undefined
  ModeResultBookmarks: undefined
}

type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>

type MainTabParamList = {
  Modes: undefined
  Chats: undefined
  Discover: undefined
  Me: undefined
}

type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>

import { SvgIconName } from '../components/SvgIcon'
import { TCustomChat, TModeResult } from '../db/types'
import type { ChatMessage, ScanBlock } from '../types'
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
  }
  CustomChat: {
    chat: TCustomChat
  }
  CustomChatInit: undefined
  AwesomePrompts: undefined
  ModeWordCollected: undefined
  ModeWordRecords: undefined
  ModeResultCollected: undefined
  ModeResultRecords: undefined
  ShareChat: {
    avatar?: string
    avatarName?: SvgIconName
    fontSize?: number
    messages: ChatMessage[]
  }
  Web: {
    title: string
    url: string
  }
  PDF: {
    title: string
    url: string
  }
  ApiKeys: undefined | { fromSettings: true }
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

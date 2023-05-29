import { SvgIconName } from '../../components/SvgIcon'
import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { hapticSuccess } from '../../haptic'
import { saveImageToAlbum } from '../../manager/album-manager'
import { useHideChatAvatarPref } from '../../preferences/storages'
import { print } from '../../printer'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { ChatMessage } from '../../types'
import { ShareButton } from './ShareButton'
import React, { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import ViewShot from 'react-native-view-shot'

export type ShotSceneProps = {
  avatar: string | undefined
  avatarName: SvgIconName | undefined
  fontSize: number
  messages: ChatMessage[]
}

export function ShotScene(props: ShotSceneProps): JSX.Element {
  const { avatar, avatarName, fontSize, messages } = props

  const { t } = useTranslation()
  const [hideChatAvatar] = useHideChatAvatarPref()

  const { backgroundChat } = useThemeScheme()

  const renderItemSeparator = () => <View style={{ height: dimensions.messageSeparator }} />

  const viewShotRef = useRef<ViewShot>(null)
  const onPress = async () => {
    try {
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        return
      }
      const tag = await viewShotRef.current.capture()
      print('Save to Album', { tag })
      const path = await saveImageToAlbum(tag)
      hapticSuccess()
      toast('success', t('Save to album success'), path ?? '')
    } catch (e) {
      toast('danger', t('Save to album error'), '')
    }
  }

  return (
    <View style={stylez.f1}>
      <ScrollView style={stylez.f1}>
        <ViewShot ref={viewShotRef}>
          <View
            style={{
              width: '100%',
              paddingTop: dimensions.messageSeparator,
              backgroundColor: backgroundChat,
            }}>
            {messages.map((item, index) => {
              if (item.role === 'user') {
                return (
                  <Fragment key={`${index}_${item.content}`}>
                    <UserMessageView
                      hideChatAvatar={hideChatAvatar}
                      fontSize={fontSize}
                      message={item}
                    />
                    {renderItemSeparator()}
                  </Fragment>
                )
              }
              if (item.role === 'assistant') {
                return (
                  <Fragment key={`${index}_${item.content}`}>
                    <AssistantMessageView
                      avatar={avatar}
                      svgIconName={avatarName}
                      hideChatAvatar={hideChatAvatar}
                      fontSize={fontSize}
                      message={item}
                    />
                    {renderItemSeparator()}
                  </Fragment>
                )
              }
              return <Fragment key={`${index}_${item.content}`} />
            })}
          </View>
        </ViewShot>
      </ScrollView>
      <ShareButton text={t('Save to Album')} onPress={onPress} />
    </View>
  )
}

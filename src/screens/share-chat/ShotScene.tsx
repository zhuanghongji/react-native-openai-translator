import { SvgIconName } from '../../components/SvgIcon'
import { AssistantMessageView } from '../../components/chat/AssistantMessageView'
import { UserMessageView } from '../../components/chat/UserMessageView'
import { hapticSoft, hapticSuccess, hapticWarning } from '../../haptic'
import { saveImageToAlbum } from '../../manager/album-manager'
import { useShowChatAvatarPref } from '../../preferences/storages'
import { print } from '../../printer'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { useThemeSelector } from '../../themes/hooks'
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
  const [showChatAvatar] = useShowChatAvatarPref()

  const backgroundColor = useThemeSelector(colors.c18, colors.cED)

  const renderItemSeparator = () => <View style={{ height: dimensions.messageSeparator }} />

  const viewShotRef = useRef<ViewShot>(null)
  const onPress = async () => {
    try {
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        return
      }
      hapticSoft()
      const tag = await viewShotRef.current.capture()
      print('Save to Album', { tag })
      const path = await saveImageToAlbum(tag)
      toast('success', t('Save to album success'), path ?? '')
      hapticSuccess()
    } catch (e) {
      toast('danger', t('Save to album error'), '')
      hapticWarning()
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
              backgroundColor,
            }}>
            {messages.map((item, index) => {
              if (item.role === 'user') {
                return (
                  <Fragment key={`${index}_${item.content}`}>
                    <UserMessageView
                      fontSize={fontSize}
                      message={item}
                      showChatAvatar={showChatAvatar}
                      colouredContextMessage={false}
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
                      fontSize={fontSize}
                      message={item}
                      showChatAvatar={showChatAvatar}
                      colouredContextMessage={false}
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

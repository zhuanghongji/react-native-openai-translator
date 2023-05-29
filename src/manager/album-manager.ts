import { print } from '../printer'
import { toast } from '../toast'
import { CameraRoll, SaveToCameraRollOptions } from '@react-native-camera-roll/camera-roll'
import { Platform } from 'react-native'
import { PERMISSIONS, check, request } from 'react-native-permissions'

export async function saveImageToAlbum(tag: string, options?: SaveToCameraRollOptions) {
  try {
    const permission =
      Platform.OS === 'android'
        ? Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.MEDIA_LIBRARY
    const result = await check(permission)
    print('saveImageToAlbum', { result })
    if (result !== 'granted') {
      const status = await request(permission)
      print('saveImageToAlbum', { status })
      if (status !== 'granted') {
        toast('danger', 'Error', 'Permission not granted')
        return Promise.reject(new Error('Permission not granted'))
      }
    }
    return await CameraRoll.save(tag, options)
  } catch (e) {
    return Promise.reject(e)
  }
}

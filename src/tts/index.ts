import Tts from 'react-native-tts'

export async function ttsWithSpecificLang(text: string, lang: string) {
  try {
    const voices = await Tts.voices()
    // console.log('voices', { voices })
    const voice = voices.find(v => {
      if (lang === 'en') {
        return v.language === 'en' || v.language === 'en-US'
      }
      return v.language === lang
    })
    if (voice) {
      // console.log('voice', { voice })
      Tts.stop()
      Tts.speak(text, {
        iosVoiceId: voice.id,
        rate: 1.0,
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      })
      return
    }
    Tts.stop()
    Tts.speak(text)
  } catch (e) {
    Tts.stop()
    Tts.speak(text)
  }
}

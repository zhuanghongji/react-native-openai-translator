# react-native-openai-translator

Not only a translator, more than just chat.

- Inspired by [OpenAI Translator](https://github.com/yetone/openai-translator)
- Powered by [OpenAI ChatGPT API](https://platform.openai.com/docs/api-reference)
- Implemented by [React Native](https://reactnative.dev/)

## Instruction

<table>
  <tr>
    <th>Translate Mode</th>
    <th>Mode Chat Continuously</th>
    <th>Settings - Light</th>
    <th>Settings - Dark</th>
    <th>Polish Mode</th>
  </tr>

  <tr>
    <td>
      <img 
        width="480" 
        src="./docs/screenshots/v0.0.1_1.jpeg" 
        alt="Special case of transe English word into Chinese" 
      />
    </td>
    <td><img width="480" src="./docs/screenshots/v0.0.1_2.jpeg"/></td>
    <td><img width="480" src="./docs/screenshots/v0.0.1_3.jpeg"/></td>
    <td><img width="480" src="./docs/screenshots/v0.0.1_4.jpeg"/></td>
    <td><img width="480" src="./docs/screenshots/v0.0.1_5.jpeg"/></td>
  </tr>
</table>

> The screenshots above are from v0.0.1, which is not the final version you are looking for.

## Rodemap

### Screens

- AITranslator
  - [x] Splash
  - [ ] Main
    - [x] Home
    - [ ] Chats
    - [ ] Explore
    - [ ] Mine
  - [ ] Scanner
  - [x] Settings
  - [x] ModeChat
  - [ ] CustomChat
  - [ ] DialogueShot
  - [ ] PromptGuideEn
  - [ ] PromptGuideZh
  - [ ] ModeCollections
  - [ ] ...

### To-Do List

- [x] feat: make translator-mode pageable in Home screen
- [ ] feat: support custom chat
- [ ] feat: support "text-shot" and "view-shot" of a single dialogue
- [ ] feat: support chat-persist by sqlite
- [ ] feat: support at least 5 user language
- [ ] feat: provide an option to hide avatars in chat
- [ ] docs: how to contribute
- [ ] docs: how to build iOS app for personal use
- [x] ux: if it is better to remove "from-lang" from the Home screen ?
- [x] ux: invert "chat-list"
- [x] refactor: reimplement theme-setting by React Context

### Maybe To-Do List

- [ ] feat: support Azure OpenAI Service
- [ ] feat: support Azure TTS
- [ ] feat: support "As keyboard everywhere"
- [ ] feat: support MarkDown preview by inner WebView
- [ ] feat: support "Big Bang English-Word"
- [ ] optimization: text-recognition-seems-not-stable on Android

## Development

### Res

- [google-icons](https://fonts.google.com/icons?icon.style=Rounded)
- [svg-to-react-native](https://transform.tools/svg-to-react-native)

### Libs

- [react-navigation](https://reactnavigation.org)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [react-native-bottom-sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
- [react-native-clipboard](https://github.com/react-native-clipboard/clipboard)
- [react-native-view-shot](https://github.com/gre/react-native-view-shot)
- [react-native-quick-sqlite](https://github.com/margelo/react-native-quick-sqlite)
- [react-native-permissions](https://github.com/zoontek/react-native-permissions#readme)
- [@react-native-camera-roll/camera-roll](https://github.com/react-native-cameraroll/react-native-cameraroll)

### Note

- `react-native-vision-camera` do not support `react-native-reanimated v3`, so we should keep the version of reanimated at `^2.14.4`.

### Build Android

```bash
# 1. Clone the souce code
git clone git@github.com:zhuanghongji/react-native-openai-translator.git

# 2. Install node modules
cd react-native-openai-translator
yarn install

# 3.1 if `debug`
yarn run start
yarn run android

# 3.2 else if `release` by terminal.
# After the following two command, you can find the apk file in
cd android
./gradlew assembleRelease

# Tip 1:
# - The applicationId of debug-apk will automatically be suffixed with `.dev` from that of the
# release-apk, so you run both debug-apk and release-apk in a single device.
# - application name of debug-apk: AIDev
# - application name of release-apk: AITranslator

# Tip 2:
# - To install the release-apk into you device, run the following commands:
# - cd ${your-project-parent-dir-path}/react-native-openai-translator/android/app/build/outputs/apk/release
# - adb install app-release.apk

# Tip 3:
# - If you have experienced slow server-sent-event requests on Android during debugging,
#   there is no need to worry as they function properly in the release version.
```

### Build iOS

```shell
# TBD
```

## License

[GNU AFFERO GENERAL PUBLIC LICENSE](./LICENSE)

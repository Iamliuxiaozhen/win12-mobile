# win12-mobile

Win12 Mobile 将 [win12-online/win12](https://github.com/win12-online/win12)
封装为基于 Capacitor 的移动端应用，覆盖 Android 和 iOS。

English documentation: [README-en_US.md](./README-en_US.md)

## 仓库结构

- `win12-code/`：上游 Win12 Web 项目的 Git 子模块。
- `mobile/`：移动端 WebView 适配补丁，包含安全区域、视口和触控行为处理。
- `www/`：由脚本生成的 Capacitor Web 资源目录，请不要手动修改。
- `android/`：Capacitor 生成的 Android 原生工程。
- `ios/`：Capacitor 生成的 iOS 原生工程。

## 初始化

```bash
git submodule update --init --recursive
npm install
npm run sync
```

## 开发命令

```bash
npm run prepare:web
npx cap sync
npx cap open android
npx cap open ios
```

`npm run prepare:web` 会把 `win12-code` 中的静态 Win12 源码复制到 `www`，
并注入移动端桥接资源。更新子模块或 `mobile/` 目录后，请重新执行
`npm run sync`。

## 平台说明

Android 工程可以在安装了 Android Studio 的环境中打开。

iOS 需要 macOS、Xcode 和 CocoaPods。如果在非 macOS 环境执行
`npx cap add ios` 或 `npx cap sync ios`，Capacitor 仍可生成项目文件，
但会跳过 CocoaPods 安装和 Xcode 清理步骤。

## 手动发版

仓库内置 GitHub Actions 工作流：`.github/workflows/manual-release.yml`。
在 GitHub 的 Actions 页面选择 `Manual Release`，填写 tag、版本名和
Android version code 后运行即可创建草稿 Release。

工作流会上传以下产物：

- Android：`.apk`、`.aab`、`.apks`
- iOS：配置签名 Secrets 后上传 `.ipa`；未配置签名时上传
  `unsigned.xcarchive.zip` 作为构建诊断产物

Android 签名 Secrets：

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

未配置 Android 签名 Secrets 时，工作流会生成临时 keystore，确保 `.apk`
和 `.apks` 可安装；正式发版请配置固定 keystore，否则用户无法在后续版本中
直接覆盖升级。

iOS 签名 Secrets：

- `IOS_CERTIFICATE_P12_BASE64`
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `IOS_KEYCHAIN_PASSWORD`
- `IOS_TEAM_ID`
- `IOS_PROVISIONING_PROFILE_NAME`
- `IOS_EXPORT_METHOD`：可选，默认 `ad-hoc`

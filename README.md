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

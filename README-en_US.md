# win12-mobile

Win12 Mobile wraps [win12-online/win12](https://github.com/win12-online/win12)
as a Capacitor app for Android and iOS.

## Repository layout

- `win12-code/`: Git submodule containing the upstream Win12 web app.
- `mobile/`: Mobile WebView overrides for safe areas, viewport behavior, and touch usage.
- `www/`: Generated web assets consumed by Capacitor. Do not edit this directory by hand.
- `android/`: Generated Capacitor Android project.
- `ios/`: Generated Capacitor iOS project.

## Setup

```bash
git submodule update --init --recursive
npm install
npm run sync
```

## Development

```bash
npm run prepare:web
npx cap sync
npx cap open android
npx cap open ios
```

`npm run prepare:web` copies the static Win12 source from `win12-code` into
`www` and injects the mobile bridge assets. Run `npm run sync` after updating
the submodule or files under `mobile/`.

## Platform notes

Android can be opened from any environment with Android Studio installed.

iOS requires macOS with Xcode and CocoaPods. If `npx cap add ios` or
`npx cap sync ios` is run outside macOS, Capacitor can still generate the
project but will skip CocoaPods and Xcode cleanup steps.

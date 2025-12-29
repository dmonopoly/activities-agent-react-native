# Activities Agent - React Native

A cross-platform mobile app for discovering activities and events, built with React Native and Expo. Works on iOS, Android, and Web.

## Features

- **AI Chat Interface**: Ask about activities, events, and things to do
- **Chat History**: Save and load previous conversations
- **User Preferences**: Set location, interests, and budget
- **Cross-Platform**: Single codebase for iOS, Android, and Web
- **Airbnb-Inspired Design**: Clean, modern UI with rose/pink accent colors

## Tech Stack

- **Expo SDK 52** - Latest Expo with new architecture enabled
- **Expo Router** - File-based navigation
- **NativeWind 4** - Tailwind CSS for React Native
- **React Native Reanimated** - Smooth animations
- **AsyncStorage** - Local data persistence
- **TypeScript** - Full type safety

## Prerequisites

- Node.js 18+ or Bun
- iOS: Xcode 15+ (for iOS development)
- Android: Android Studio with SDK 34+ (for Android development)
- Expo CLI (installed globally or via npx)

## Getting Started

### 1. Install Dependencies

```bash
cd activities-agent-react-native
npm install
# or
bun install
```

### 2. Create Placeholder Assets (if not present)

```bash
python3 scripts/create-assets.py
```

### 3. Start the Development Server

```bash
npx expo start
```

### 4. Run on Platform

- **iOS Simulator**: Press `i` in the terminal or scan QR with Expo Go
- **Android Emulator**: Press `a` in the terminal or scan QR with Expo Go
- **Web**: Press `w` in the terminal

## Configuration

### API Base URL

By default, the app connects to `http://localhost:8000/api`. To change this:

1. Edit `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api-url.com/api"
    }
  }
}
```

2. For Android emulator, use `10.0.2.2` instead of `localhost`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://10.0.2.2:8000/api"
    }
  }
}
```

## Project Structure

```
activities-agent-react-native/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with drawer navigation
│   ├── index.tsx           # Chat screen (home)
│   ├── history.tsx         # Chat history list
│   ├── preferences.tsx     # User preferences form
│   └── chat/
│       └── [id].tsx        # Load specific chat
├── components/
│   ├── chat/               # Chat-related components
│   ├── history/            # History list components
│   ├── preferences/        # Preferences form components
│   └── ui/                 # Shared UI components
├── services/
│   ├── api.ts              # API client
│   └── storage.ts          # AsyncStorage wrapper
├── constants/
│   └── colors.ts           # Color palette
├── types/
│   └── index.ts            # TypeScript interfaces
└── global.css              # Tailwind base styles
```

## Building for Production

### iOS (requires Apple Developer account)

```bash
npx expo build:ios
# or with EAS
eas build --platform ios
```

### Android

```bash
npx expo build:android
# or with EAS
eas build --platform android
```

### Web

```bash
npx expo export --platform web
```

## Backend

This app connects to the same backend as the web frontend. Make sure the backend is running:

```bash
cd ../activities-agent/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## License

MIT


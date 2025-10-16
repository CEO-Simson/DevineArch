# TIMA Church Mobile App

Flutter mobile application for TIMA Church Management System.

## Features

- **Invite Code Registration**: Users can register using invite codes (#XXXX000) provided by church admins
- **Phone-based Authentication**: Login using phone number (passwordless)
- **Organization Integration**: Automatically connects users to their church organization
- **Cross-platform**: Runs on both Android and iOS

## Getting Started

### Prerequisites

- Flutter SDK (3.9.0 or later)
- Dart SDK
- Android Studio or Xcode (for iOS development)

### Installation

1. Install dependencies:
```bash
cd apps/mobile
flutter pub get
```

2. Configure API URL:
   - Open `lib/services/api_service.dart`
   - Update `baseUrl` to your API server URL
   - For local development on Android emulator: `http://10.0.2.2:4000`
   - For local development on iOS simulator: `http://localhost:4000`
   - For local development on physical device: `http://YOUR_LOCAL_IP:4000`

### Running the App

#### Android
```bash
flutter run
```

#### iOS
```bash
flutter run -d ios
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── user.dart
│   └── organization.dart
├── screens/                  # UI screens
│   ├── login_screen.dart
│   ├── registration_screen.dart
│   └── home_screen.dart
└── services/                 # Business logic
    ├── api_service.dart      # API client
    └── auth_provider.dart    # Authentication state management
```

## Authentication Flow

### Registration
1. User enters invite code (#XXXX000)
2. System verifies invite code with backend
3. User provides name and phone number
4. Account created and linked to organization
5. JWT token stored securely
6. User redirected to home screen

### Login
1. User enters phone number
2. System authenticates with backend
3. JWT token retrieved and stored
4. User redirected to home screen

> **Note**: In production, add OTP verification for secure phone-based login

## Building for Production

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## License

Proprietary - TIMA Church Management System

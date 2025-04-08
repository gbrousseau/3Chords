# 3 Cords Coaching

A modern mobile application designed to provide a comprehensive coaching platform for personal and professional growth.

## Project Overview

3 Cords Coaching is a React Native application built with Expo that offers personalized coaching services, goal tracking, community features, and educational resources. The platform connects users with coaches and provides tools for personal development and growth tracking.

## Features

### User Experience
- **Modern Onboarding Flow**: Introduction to the platform's core values and services
- **Subscription Management**: Tiered access to coaching services and premium features
- **Profile Management**: Customizable user profiles with service preferences

### Core Functionality
- **Coaching Rooms**: Direct communication with coaches in specialized areas
- **Goal Tracker**: Set, monitor, and achieve personal and professional goals with detailed tracking
- **Journey Journal**: Document growth and progress over time
- **Assignment Tracking**: Manage tasks assigned by coaches

### Content & Resources
- **Video Library**: Categorized educational videos with playback functionality
- **Events Calendar**: RSVP to upcoming coaching events with attendance tracking
- **Shoutout Corner**: Celebrate community achievements
- **Testimonials**: Success stories from community members

### Community Features
- **Profile Search**: Connect with peers and coaches (Premium feature)
- **Accountability Tools**: Track progress and commitments
- **Speaker Request**: Book speakers for events

## Tech Stack

- **Frontend**: React Native, Expo
- **UI Components**: React Native components, Lucide React Native icons
- **Styling**: React Native StyleSheet
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Media**: Expo AV, Image Picker
- **Animations**: React Native Reanimated
- **Gradients & Effects**: Expo Linear Gradient

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/3chords_new.git
cd 3chords_new
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure Firebase
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration in `firebaseConfig.ts`
   - Place your `google-services.json` and `GoogleService-Info.plist` in the root directory

4. Start the development server
```bash
npx expo start
```

### Firebase Collections Structure

The app uses the following Firestore collections:
- `users`: User profiles and preferences
- `goals`: User's personal and professional goals
- `events`: Upcoming coaching events with RSVP functionality
- `videos`: Educational content categorized by service

## Project Structure

- `app/`: Main application screens and components
  - `(auth)/`: Authentication screens
  - `(onboarding)/`: Onboarding flow screens
  - `(screens)/`: Main application screens
- `assets/`: Images, fonts, and other static assets
- `components/`: Reusable UI components
- `constants/`: Application constants and configuration
- `context/`: React Context providers
- `types/`: TypeScript interfaces and types
- `firebaseConfig.ts`: Firebase configuration

## License

[Your License Here]

## Contact

For support or inquiries, please contact [your contact information]. 
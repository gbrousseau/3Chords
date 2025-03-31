require('@testing-library/jest-native/extend-expect');

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants');
jest.mock('expo-linking');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  Link: 'Link',
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// Mock Firebase
jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: () => ({
    app: jest.fn(),
    initializeApp: jest.fn(),
  }),
  firebase: {
    app: jest.fn(),
    initializeApp: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    GoogleAuthProvider: {
      credential: jest.fn(() => 'mock-credential'),
    },
    OAuthProvider: jest.fn(() => ({
      credential: jest.fn(),
    })),
  }),
  firebase: {
    auth: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    Timestamp: {
      fromDate: jest.fn(date => ({ toDate: () => date })),
    },
    FieldValue: {
      serverTimestamp: jest.fn(),
    },
  }),
}));

// Mock Google Sign In
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [
    { type: 'success' },
    { type: 'success', params: { id_token: 'mock-token' } },
    jest.fn(),
  ],
}));

// Mock Apple Authentication
jest.mock('expo-apple-authentication', () => ({
  AppleAuthenticationScope: {
    FULL_NAME: 'full_name',
    EMAIL: 'email',
  },
  signInAsync: jest.fn(() => Promise.resolve({
    identityToken: 'mock-token',
  })),
}));

// Mock linear gradient
jest.mock('expo-linear-gradient', () => 'LinearGradient');

// Mock React Native core modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios),
  },
  NativeModules: {},
  NativeEventEmitter: jest.fn(),
  Animated: {
    Value: jest.fn(),
    timing: jest.fn(),
    spring: jest.fn(),
    createAnimatedComponent: jest.fn(component => component),
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  StyleSheet: {
    create: jest.fn(styles => styles),
  },
}));

// Mock WebBrowser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

// Mock the async storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
); 
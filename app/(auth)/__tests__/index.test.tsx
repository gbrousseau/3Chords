import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AuthScreen from '../index';
import { AuthProvider } from '../../context/AuthContext';

// Mock the Google auth request hook
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [
    { type: 'success' },
    { type: 'success', authentication: { accessToken: 'mock-token' } },
    jest.fn(),
  ],
}));

// Mock the navigation prop
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
}
);
// Mock the AuthContext
jest.mock('../../context/AuthContext', () => {
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
      signInWithGoogle: jest.fn(),
      signInWithEmail: jest.fn(),
      signUp: jest.fn(),
    }),
  };
});

// Mock the useAuthRequest hook
jest.mock('expo-auth-session', () => {
  return {
    useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
  };
});
// Mock the useAuthRequest hook from expo-auth-session/providers/google
jest.mock('expo-auth-session/providers/google', () => {
  return {
    useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
  };
});

describe('AuthScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue your coaching journey')).toBeTruthy();
    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByText('Continue with Email')).toBeTruthy();
    expect(getByText("Don't have an account?")).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
  });

  it('handles Google sign in button press', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    const googleButton = getByText('Continue with Google');
    fireEvent.press(googleButton);
    // Add assertions for Google sign-in flow
  });

  it('navigates to welcome screen on Google button press', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    const googleButton = getByText('Continue with Google');
    fireEvent.press(googleButton);
    // Add assertions for navigation
  });

  it('handles email sign in button press', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    const emailButton = getByText('Continue with Email');
    fireEvent.press(emailButton);
    // Add assertions for email sign-in flow
  });

  it('navigates to welcome screen on email button press', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    const emailButton = getByText('Continue with Email');
    fireEvent.press(emailButton);
    // Add assertions for navigation
  });

  it('handles sign up button press', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    const signupButton = getByText('Sign up');
    fireEvent.press(signupButton);
    // Add assertions for sign-up flow
  });



  it('navigates to signup screen', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>
    );

    const signupButton = getByText('Sign up');
    fireEvent.press(signupButton);
    // Add assertions for navigation
  });
}); 
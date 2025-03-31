import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuthContext } from '../AuthContext';
import { expect } from '@jest/globals';
import auth from '@react-native-firebase/auth';

jest.mock('@react-native-firebase/auth');

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

jest.mock('expo-auth-session', () => ({
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('handles sign in', async () => {
    const mockSignIn = jest.fn();
    (auth as unknown as jest.Mock).mockImplementation(() => ({
      signInWithEmailAndPassword: mockSignIn,
    }));

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles sign up', async () => {
    const mockSignUp = jest.fn();
    (auth as unknown as jest.Mock).mockImplementation(() => ({
      createUserWithEmailAndPassword: mockSignUp,
    }));

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp('test@example.com', 'password');
    });

    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles sign out', async () => {
    const mockSignOut = jest.fn();
    (auth as unknown as jest.Mock).mockImplementation(() => ({
      signOut: mockSignOut,
    }));

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('handles auth state changes', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockOnAuthStateChanged = jest.fn((callback) => {
      callback(mockUser);
      return jest.fn(); // unsubscribe function
    });

    (auth as unknown as jest.Mock).mockImplementation(() => ({
      onAuthStateChanged: mockOnAuthStateChanged,
    }));

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });
}); 
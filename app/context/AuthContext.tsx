import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '85339006592-e3gltpi9kunsa2mfff3sam9elm1p3a2d.apps.googleusercontent.com',
    iosClientId: '85339006592-oe2n2n96tps7j6nve4elsqq0ah488rso.apps.googleusercontent.com',
    webClientId: '85339006592-e3gltpi9kunsa2mfff3sam9elm1p3a2d.apps.googleusercontent.com',
    redirectUri: Platform.select({
      ios: 'com.yourcompany.threechords:/oauth2redirect/google',
      android: 'com.yourcompany.threechords:/oauth2redirect/google'
    })
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = auth.GoogleAuthProvider.credential(id_token);
      auth().signInWithCredential(credential)
        .catch(error => {
          console.error('Firebase credential error:', error);
        });
    } else if (response?.type === 'error') {
      console.error('Google Sign-In Error:', response.error);
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'error') {
        console.error('Prompt Error:', result.error);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      if (Platform.OS === 'ios') {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const { identityToken } = credential;
        const provider = new auth.OAuthProvider('apple.com');
        const oAuthCredential = provider.credential(identityToken!);
        await auth().signInWithCredential(oAuthCredential);
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    signInWithApple,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider };
export default AuthProvider; 
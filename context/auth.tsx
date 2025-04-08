import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Goal, UserType } from '@/types/userTypes';
import { Alert } from 'react-native';

const auth = FIREBASE_AUTH;
const usersCollection = collection(FIREBASE_FIRESTORE, 'users');

interface AuthContextType {
  user: User | null;
  userData: UserType | null;
  goals: Goal[];
  loading: boolean;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: auth.currentUser || null,
  userData: null,
  goals: [],
  loading: true,
  error: null,
  resetPassword: async () => { },
  clearError: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setAuthUser(user);
        setLoading(false);

        if (user) {
          const goalsRef = user.uid ? doc(FIREBASE_FIRESTORE, 'goals', user.uid) : null;
          if (goalsRef) {
            const docSnap = await getDoc(goalsRef);
            if (docSnap.exists()) {
              setGoals(docSnap.data().goals as Goal[]);
            }
          }

          const userDocRef = doc(usersCollection, user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userDataFromDB = userDocSnap.data() as UserType;
            setUserData(userDataFromDB);
          } else {
            const newUserData: UserType = {
              email: user.email || "",
              id: user.uid || "",
              firstName: "",
              lastName: "",
              profilePic_url: "",
              subscription: "",
              type: "user",
            };

            try {
              await setDoc(userDocRef, newUserData);
              setUserData(newUserData);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to create user profile';
              setError(errorMessage);
              Alert.alert(
                'Profile Setup Error',
                'There was an error setting up your profile. Please try again or contact support.',
                [
                  { 
                    text: 'Try Again',
                    onPress: () => router.replace('/(auth)')
                  }
                ]
              );
            }
          }
        } else {
          setUserData(null);
          setGoals([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        Alert.alert(
          'Authentication Error',
          'There was a problem with the authentication process. Please try again.',
          [
            { 
              text: 'OK',
              onPress: () => router.replace('/(auth)')
            }
          ]
        );
      }
    });

    return unsubscribe;
  }, []);

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setError(errorMessage);
      Alert.alert(
        'Password Reset Error',
        'Failed to send password reset email. Please check your email address and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user: authUser,
      userData,
      loading,
      goals,
      error,
      resetPassword,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useProtectedRoute() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)');
    }
  }, [user, loading]);

  return { user, loading };
} 
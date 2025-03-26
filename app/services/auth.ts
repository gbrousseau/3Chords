import auth from '@react-native-firebase/auth';

export const signIn = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signUp = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signIn(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const createUserWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signUp(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}; 
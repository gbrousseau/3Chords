import firestore from '@react-native-firebase/firestore';
import { UserProfile, AssessmentData } from '../types/user';

export async function createUserProfile(
  userId: string,
  email: string,
  assessmentData: AssessmentData
): Promise<void> {
  const userProfile: Omit<UserProfile, 'id'> = {
    email,
    ...assessmentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await firestore().doc(`users/${userId}`).set({
    ...userProfile,
    createdAt: firestore.Timestamp.fromDate(userProfile.createdAt),
    updatedAt: firestore.Timestamp.fromDate(userProfile.updatedAt),
  });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docSnap = await firestore().doc(`users/${userId}`).get();

  if (docSnap.exists) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as UserProfile;
  }

  return null;
}

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await firestore().doc(`users/${userId}`).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}; 
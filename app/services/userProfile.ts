import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
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

  await setDoc(doc(db, 'users', userId), userProfile);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as UserProfile;
  }

  return null;
}

export async function updateUserProfile(
  userId: string,
  assessmentData: AssessmentData
): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...assessmentData,
    updatedAt: serverTimestamp(),
  });
} 
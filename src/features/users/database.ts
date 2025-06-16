import { doc, getDoc, setDoc } from 'firebase/firestore';
import { type User } from '@/types/models';
import { database } from '@/configs/app';
import { converter } from '@/features/utils';

export async function createUser(userData: User) {
  await setDoc(
    doc(database, 'users', userData.id).withConverter(converter<User>()),
    userData,
  );
}

export async function fetchUser(userId: string): Promise<User> {
  const userDoc = await getDoc(
    doc(database, 'users', userId).withConverter(converter<User>()),
  );

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  return userDoc.data();
}

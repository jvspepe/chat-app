import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as signUserOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type User from '@/types/user';
import { auth, database } from '@/firebase/config';
import { converter } from '@/firebase/utils';

export function handleCurrentUser(
  callback: (user: FirebaseUser | null) => void,
) {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
    callback(currentUser),
  );

  return unsubscribe;
}

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  try {
    // Create user
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await Promise.all([
      // Update user's `displayName` attribute
      updateProfile(user, { displayName: name }),
      // Save it to the database
      setDoc(
        doc(database, 'users', user.uid).withConverter(converter<User>()),
        {
          id: user.uid,
          email,
          name,
        },
      ),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export async function signIn(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
  }
}

export async function signOut() {
  try {
    await signUserOut(auth);
  } catch (error) {
    console.log(error);
  }
}

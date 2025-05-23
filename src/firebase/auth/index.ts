/* eslint-disable no-useless-catch */
import {
  type User as FirebaseUser,
  browserLocalPersistence,
  browserSessionPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as signUserOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type User from '@/types/user';
import { auth, database } from '@/firebase/config';
import { converter } from '@/firebase/utils';
import { env } from '@/lib/utils';

export function handleCurrentUser(
  callback: (user: FirebaseUser | null) => void,
) {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
    callback(currentUser),
  );

  return unsubscribe;
}

async function handleKeepConnected(keepConnected: boolean) {
  try {
    await setPersistence(
      auth,
      keepConnected ? browserLocalPersistence : browserSessionPersistence,
    );
  } catch (error) {
    throw error;
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  keepConnected: boolean = false,
): Promise<void> {
  try {
    await handleKeepConnected(keepConnected);

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await Promise.all([
      updateProfile(user, { displayName: name }),
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
    throw error;
  }
}

export async function signIn(
  email: string,
  password: string,
  keepConnected: boolean = false,
) {
  try {
    await handleKeepConnected(keepConnected);

    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await signUserOut(auth);
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email, {
      // Sets a continue url after user action is completed, such as reset password success.
      url: env.VITE_FIREBASE_CONTINUE_URL,
    });
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(code: string, password: string) {
  try {
    await confirmPasswordReset(auth, code, password);
  } catch (error) {
    throw error;
  }
}

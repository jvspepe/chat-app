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
import { env } from '@/configs/env';
import { auth } from '@/configs/app';
import { createUser } from '@/features/users';
import { uploadImage } from '@/features/storage';

export function handleCurrentUser(
  callback: (user: FirebaseUser | null) => void,
) {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
    callback(currentUser),
  );

  return unsubscribe;
}

async function handleKeepUserConnected(keepConnected: boolean) {
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
  username: string,
  displayName: string,
  avatar: File,
  keepConnected: boolean = false,
): Promise<void> {
  try {
    await handleKeepUserConnected(keepConnected);

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const avatarUrl = await uploadImage(`avatars/${user.uid}`, avatar);

    await Promise.all([
      updateProfile(user, { displayName, photoURL: avatarUrl }),
      createUser({
        id: user.uid,
        email,
        username,
        displayName,
        avatarUrl,
      }),
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
    await handleKeepUserConnected(keepConnected);

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

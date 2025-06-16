import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { type User as AuthUser } from 'firebase/auth';
import { type User } from '@/types/models';
import { fetchUser } from '@/features/users/database';
import { handleCurrentUser } from '@/features/users';
import { AuthContext } from './context';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const value = useMemo(
    () => ({ currentUser, currentUserData }),
    [currentUser, currentUserData],
  );

  useEffect(() => {
    const unsubscribe = handleCurrentUser((user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
      } else {
        fetchUser(user.uid)
          .then((userData) => {
            setCurrentUser(user);
            setCurrentUserData(userData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext value={value}>{!loading && children}</AuthContext>;
}

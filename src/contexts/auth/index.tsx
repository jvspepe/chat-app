import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { type User } from 'firebase/auth';
import { handleCurrentUser } from '@/features/users';
import { AuthContext } from './context';

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const value = useMemo(() => ({ currentUser }), [currentUser]);

  useEffect(() => {
    const unsubscribe = handleCurrentUser((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext value={value}>{!loading && children}</AuthContext>;
}

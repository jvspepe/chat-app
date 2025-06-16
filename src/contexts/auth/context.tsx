import { createContext } from 'react';
import { type User as AuthUser } from 'firebase/auth';
import { type User } from '@/types/models';

export interface IAuthContext {
  currentUser: AuthUser | null;
  currentUserData: User | null;
}

const AuthContext = createContext<IAuthContext | null>(null);

export { AuthContext };

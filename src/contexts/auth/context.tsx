import { createContext } from 'react';
import { type User } from 'firebase/auth';

export interface IAuthContext {
  currentUser: User | null;
}

const AuthContext = createContext<IAuthContext | null>(null);

export { AuthContext };

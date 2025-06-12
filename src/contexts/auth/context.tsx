import { createContext } from 'react';
import { type User } from 'firebase/auth';

interface AuthContext {
  currentUser: User | null;
}

const AuthContext = createContext<AuthContext | null>(null);

export { AuthContext };

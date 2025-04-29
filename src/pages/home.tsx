import { Link } from 'react-router';
import useAuth from '@/contexts/auth/hook';
import { Button } from '@/components/ui/button';
import { signOut } from '@/firebase/auth';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-4">
        {!currentUser ? (
          <>
            <Button asChild>
              <Link to="/sign-up">Criar conta</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-in">Conectar</Link>
            </Button>
          </>
        ) : (
          <Button
            onClick={signOut}
            type="button"
          >
            Sair
          </Button>
        )}
      </div>
    </div>
  );
}

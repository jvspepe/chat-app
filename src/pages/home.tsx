import { Link } from 'react-router';
import { paths } from '@/configs/paths';
import { Button } from '@/components/ui/button';

export function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link to={paths.signUp}>Criar conta</Link>
        </Button>
        <Button asChild>
          <Link to={paths.signIn}>Conectar</Link>
        </Button>
      </div>
    </div>
  );
}

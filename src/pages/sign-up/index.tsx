import { Link } from 'react-router';
import { paths } from '@/configs/paths';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpForm } from './sign-up-form';

export function SignUp() {
  return (
    <Card className="min-w-80">
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>para usar nossa plataforma</CardDescription>
        <div className="text-sm">
          <span>Já possui uma conta?</span>{' '}
          <Button
            asChild
            variant="link"
            className="p-0"
          >
            <Link to={paths.signIn}>Conectar</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}

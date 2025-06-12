import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInForm } from './sign-in-form';

export function SignIn() {
  return (
    <Card className="min-w-80">
      <CardHeader>
        <CardTitle>Conecte-se em sua conta</CardTitle>
        <CardDescription>para usar nossa plataforma</CardDescription>
        <div className="text-sm">
          <span>Não possui uma conta?</span>{' '}
          <Button
            asChild
            variant="link"
            className="p-0"
          >
            <Link to="/sign-up">Criar</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}

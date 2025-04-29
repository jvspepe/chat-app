import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { resetPassword } from '@/firebase/auth';
import { handleError } from '@/firebase/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';

const REQUIRED_FIELD = 'Campo obrigatório';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Mínimo de  8 caractéres')
      .nonempty(REQUIRED_FIELD),
    passwordConfirm: z
      .string()
      .min(8, 'Mínimo de  8 caractéres')
      .nonempty(REQUIRED_FIELD),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas devem ser iguais',
        path: ['password', 'passwordConfirm'],
      });
    }
  });

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  password: '',
  passwordConfirm: '',
};

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();

  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const { password } = data;

      const code = searchParams.get('oobCode');

      if (!code) throw new Error('Código inválido');

      await resetPassword(code, password);
    } catch (error) {
      form.setError('root', { message: handleError(error) });
      form.reset(defaultValues, { keepErrors: true });
    }
  };

  return (
    <Card className="min-w-80">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Insira uma nova senha</CardTitle>
          <CardDescription>para acessar sua conta</CardDescription>
        </div>
        <Button
          asChild
          size="icon"
          variant="outline"
        >
          <Link to="/login">
            <FaArrowLeft />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            {form.formState.errors.root && (
              <span className="rounded-md border border-red-500 bg-red-500/25 p-1 text-center text-red-500">
                {form.formState.errors.root.message}
              </span>
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      placeholder="Mínimo de 8 caracéres"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo de 8 caracéres"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Carregando...</span>
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

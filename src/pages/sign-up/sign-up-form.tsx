import { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaSpinner } from 'react-icons/fa6';
import type User from '@/types/user';
import { signUp } from '@/firebase/auth';
import { handleError } from '@/firebase/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input as FormInput } from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';

const REQUIRED_FIELD = 'Campo obrigatório';

const formSchema = z
  .object({
    name: z.string().nonempty(REQUIRED_FIELD),
    email: z.string().email('E-mail inválido').nonempty(REQUIRED_FIELD),
    password: z.string().min(8, 'Mínimo 8 caractéres').nonempty(REQUIRED_FIELD),
    passwordConfirm: z
      .string()
      .min(8, 'Mínimo 8 caractéres')
      .nonempty(REQUIRED_FIELD),
    keepConnected: z.boolean(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas devem ser iguais',
        path: ['password', 'passwordConfirm'],
      });
    }
  }) satisfies z.ZodSchema<Omit<User, 'id'>>;

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  keepConnected: false,
};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data): Promise<void> => {
    const { name, email, password } = data;

    try {
      await signUp(email, password, name);

      void navigate('/');
    } catch (error) {
      form.setError('root', { message: handleError(error) });
      form.reset(defaultValues, { keepErrors: true });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {form.formState.errors.root && (
          <span className="rounded-md border border-red-500 bg-red-500/25 p-1 text-center text-red-500">
            {form.formState.errors.root.message}
          </span>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <FormInput
                  {...field}
                  type="text"
                  placeholder="Seu nome"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <FormInput
                  {...field}
                  type="email"
                  placeholder="Seu e-mail"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  placeholder="Sua senha"
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
                <FormInput
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keepConnected"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Manter-se conectado?</FormLabel>
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
  );
}

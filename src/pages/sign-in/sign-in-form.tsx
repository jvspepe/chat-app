import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaSpinner } from 'react-icons/fa6';
import { signIn } from '@/firebase/auth';
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
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';

const REQUIRED_FIELD = 'Campo obrigatório';

const formSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty(REQUIRED_FIELD),
  password: z.string().min(8, 'Mínimo 8 caractéres').nonempty(REQUIRED_FIELD),
  keepConnected: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  email: '',
  password: '',
  keepConnected: false,
};

export default function SignInForm() {
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const { email, password } = data;

      await signIn(email, password);

      await navigate('/');
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
          <span className="border-destructive bg-destructive/20 text-destructive rounded-md border p-1 text-center">
            {form.formState.errors.root.message}
          </span>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
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
              <FormLabel className="text-xs">Manter-se conectado?</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
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
          <Button
            asChild
            variant="link"
            className="p-0"
          >
            <Link to="/forgot-password">Esqueceu sua senha? </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

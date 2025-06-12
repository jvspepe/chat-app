import { Link } from 'react-router';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { forgotPassword } from '@/features/users';
import { handleError } from '@/features/utils';
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

const formSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty('Campo obrigatório'),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  email: '',
};

export default function ForgotPassword() {
  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    formState: { isSubmitted },
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const { email } = data;

      await forgotPassword(email);
    } catch (error) {
      form.setError('root', { message: handleError(error) });
      form.reset(defaultValues, { keepErrors: true });
    }
  };

  return (
    <Form {...form}>
      <Card className="min-w-80">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>
              {!isSubmitted ? 'Insira seu e-mail' : 'E-mail enviado'}
            </CardTitle>
            <CardDescription>
              {!isSubmitted
                ? 'para recuperar seu acesso'
                : 'verifique sua caixa de entrada'}
            </CardDescription>
          </div>
          <Button
            asChild
            size="icon"
            variant="outline"
          >
            <Link to="/sign-in">
              <FaArrowLeft aria-hidden />
              <span className="sr-only">Voltar à pagina de login</span>
            </Link>
          </Button>
        </CardHeader>
        {!isSubmitted && (
          <CardContent>
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Enviando e-mail...{' '}
                  </>
                ) : (
                  'Enviar e-mail'
                )}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
    </Form>
  );
}

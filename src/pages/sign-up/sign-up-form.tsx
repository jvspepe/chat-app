import { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { useTranslation } from 'react-i18next';
import { FaCamera, FaSpinner, FaUpload } from 'react-icons/fa6';
import { UserSchema } from '@/types/models';
import { env } from '@/configs/env';
import { signUp } from '@/features/users';
import { handleError } from '@/features/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

const REQUIRED_FIELD = 'Campo obrigatório';

const formSchema = UserSchema.pick({
  email: true,
  username: true,
})
  .extend({
    firstName: z
      .string()
      .min(2, 'Mínimo 2 caractéres')
      .nonempty(REQUIRED_FIELD),
    lastName: z.string().min(2, 'Mínimo 2 caractéres').nonempty(REQUIRED_FIELD),
    password: z.string().min(8, 'Mínimo 8 caractéres').nonempty(REQUIRED_FIELD),
    passwordConfirm: z
      .string()
      .min(8, 'Mínimo 8 caractéres')
      .nonempty(REQUIRED_FIELD),
    avatar: z.instanceof(FileList).nullable(),
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
  });

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  avatar: null,
  keepConnected: false,
};

export function SignUpForm() {
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const avatar = form.register('avatar');

  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormSchema> = async (data): Promise<void> => {
    const { username, firstName, lastName, email, password, avatar } = data;

    if (!avatar || avatar.length === 0) {
      form.setError('avatar', { message: 'Por favor, selecione uma imagem.' });
      return;
    }

    const avatarFile = avatar[0];

    try {
      await signUp(
        email,
        password,
        username,
        firstName.concat(' ', lastName),
        avatarFile,
      );

      void navigate('/chats');
    } catch (error) {
      console.log(error);
      form.setError('root', { message: handleError(error) });
      form.reset(defaultValues, { keepErrors: true });
    }
  };

  return (
    <>
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
          <FormItem className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage
                src={avatarPreview}
                className="object-cover"
              />
              <AvatarFallback>
                <FaCamera
                  aria-hidden
                  size={24}
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <FormLabel>
                  <FaUpload aria-hidden />
                  {t('auth.signUp.profilePicture')}
                </FormLabel>
              </Button>
              <FormDescription>.png, .jpg, up to 5mb</FormDescription>
            </div>
            <FormControl>
              <Input
                {...avatar}
                onChange={(event) => {
                  setAvatarPreview(URL.createObjectURL(event.target.files![0]));
                  void avatar.onChange(event);
                }}
                type="file"
                className="hidden"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.signUp.firstName')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t('auth.signUp.firstName')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.signUp.lastName')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t('auth.signUp.lastName')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.signUp.username')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t('auth.signUp.username')}
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
                <FormLabel>{t('auth.signUp.email')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t('auth.signUp.email')}
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
                <FormLabel>{t('auth.signUp.password')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    placeholder={t('auth.signUp.password')}
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
                <FormLabel>{t('auth.signUp.confirmPassword')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.signUp.confirmPassword')}
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
                <FormLabel>{t('auth.signUp.rememberMe')}</FormLabel>
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
                <span>{t('common.loading')}</span>
              </>
            ) : (
              t('common.confirm')
            )}
          </Button>
        </form>
      </Form>
      {env.MODE === 'development' && <DevTool control={form.control} />}
    </>
  );
}

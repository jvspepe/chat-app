import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlusIcon } from 'lucide-react';
import { type FriendRequest } from '@/types/models';
import { useAuth } from '@/contexts/auth/hook';
import {
  createFriendRequest,
  subscribeToUserFriendRequests,
} from '@/features/friend-requests';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FriendRequestCard } from './friend-request-card';

const formSchema = z.object({
  username: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  username: '',
};

export function FriendRequestDialog() {
  const { currentUser, currentUserData } = useAuth();

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const receivedRequests = friendRequests.filter(
    (request) => request.receiverData.id === currentUser?.uid,
  );

  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (!currentUserData) return;

    const { id, displayName, username, avatarUrl } = currentUserData;

    toast.promise(
      createFriendRequest(
        {
          id,
          displayName,
          username,
          avatarUrl,
        },
        data.username,
      ),
      {
        loading: t('common.loading'),
        success: t('common.success'),
        error(arg: Error) {
          console.log(arg);
          return {
            type: 'error',
            message: arg.message,
          };
        },
      },
    );
  };

  useEffect(() => {
    if (!currentUser) return;

    const unsub = subscribeToUserFriendRequests(currentUser.uid, (data) => {
      // After getting the requests, get the users' information
      setFriendRequests(data);
    });

    return () => unsub();
  }, [currentUser]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
        >
          <UserPlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('friend-requests.heading')}</DialogTitle>
          <DialogDescription>
            {t('friend-requests.description')}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div>
          <h2 className="text-lg leading-none font-semibold">Received</h2>
          <div className="flex flex-col gap-2">
            {receivedRequests.map((request) => (
              <FriendRequestCard
                key={request.id}
                friendRequest={request}
              />
            ))}
          </div>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('friend-requests.inputs.username')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t(
                        'friend-requests.inputs.username-placeholder',
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t('friend-requests.buttons.send')}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

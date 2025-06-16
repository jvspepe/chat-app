import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().nonempty(),
  username: z
    .string()
    .min(3)
    .max(20)
    .trim()
    .regex(
      /^[a-z0-9-]+$/,
      'Somente letras minúsculas, números e hífens são permitidos',
    ),
  displayName: z.string().nonempty().trim(),
  avatarUrl: z.string().url(),
});

export type User = z.infer<typeof UserSchema>;

const FriendRequestUserDataSchema = UserSchema.pick({
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
});

export type FriendRequestUserData = z.infer<typeof FriendRequestUserDataSchema>;

export const FriendRequestSchema = z.object({
  id: z.string(),
  senderData: FriendRequestUserDataSchema,
  receiverData: FriendRequestUserDataSchema,
  status: z.enum(['pending', 'accepted', 'rejected']),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export type FriendRequest = z.infer<typeof FriendRequestSchema>;

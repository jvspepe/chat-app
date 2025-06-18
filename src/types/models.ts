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

const UserDataSchema = UserSchema.pick({
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
});

export type UserData = z.infer<typeof UserDataSchema>;

export const FriendRequestSchema = z.object({
  id: z.string(),
  senderData: UserDataSchema,
  receiverData: UserDataSchema,
  status: z.enum(['pending', 'accepted', 'rejected']),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export type FriendRequest = z.infer<typeof FriendRequestSchema>;

export const ChatSchema = z.object({
  id: z.string(),
  memberIds: z.array(z.string()),
  memberData: z.record(z.string(), UserDataSchema),
  lastMessage: z
    .object({
      senderId: z.string(),
      content: z.string(),
      timestamp: z.instanceof(Timestamp),
    })
    .optional(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export type Chat = z.infer<typeof ChatSchema>;

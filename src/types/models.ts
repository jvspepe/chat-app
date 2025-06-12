import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  username: string;
}

export const FriendRequestSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export type FriendRequest = z.infer<typeof FriendRequestSchema>;

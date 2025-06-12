import { database } from '@/configs/app';
import { FriendRequest } from '@/types/models';
import {
  collection,
  doc,
  documentId,
  getCountFromServer,
  getDocs,
  or,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';

async function checkFriendRequest(senderId: string, receiverId: string) {
  const friendRequestQuery = query(
    collection(database, 'friend_requests'),
    or(
      where(documentId(), '==', `${senderId}_${receiverId}`),
      where(documentId(), '==', `${receiverId}_${senderId}`),
    ),
  );

  const check = await getCountFromServer(friendRequestQuery);

  return check.data().count;
}

export async function createFriendRequest(
  senderId: string,
  receiverUsername: string,
) {
  // 1 - Get user document with matching username
  const receiverQuery = query(
    collection(database, 'users'),
    where('username', '==', receiverUsername),
  );

  const receiverDoc = await getDocs(receiverQuery);

  // 2 - If no user is found, handle error/return
  if (receiverDoc.empty) {
    throw new Error(`User with username ${receiverUsername} not found`);
  }

  const receiverId = receiverDoc.docs[0].id;

  // Check if friend-request already exists, if true, handle error/return
  if (await checkFriendRequest(senderId, receiverId)) {
    throw new Error(`Friend request already exists`);
  }

  const timestamp = Timestamp.now();

  const friendRequestData: FriendRequest = {
    id: `${senderId}_${receiverId}`,
    senderId,
    receiverId,
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Create friend request
  await setDoc(
    doc(database, 'friend_requests', friendRequestData.id),
    friendRequestData,
  );
}

export async function updateFriendRequest(
  friendRequestId: string,
  status: FriendRequest['status'],
) {
  const friendRequestDoc = doc(database, 'friend_requests', friendRequestId);

  const friendRequestData: Pick<FriendRequest, 'status' | 'updatedAt'> = {
    status,
    updatedAt: Timestamp.now(),
  };

  await setDoc(friendRequestDoc, friendRequestData);
}

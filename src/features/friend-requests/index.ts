import {
  collection,
  doc,
  documentId,
  getCountFromServer,
  getDocs,
  onSnapshot,
  or,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import {
  type FriendRequestUserData,
  type User,
  type FriendRequest,
} from '@/types/models';
import { database } from '@/configs/app';
import { converter } from '@/features/utils';

async function checkFriendRequest(
  senderId: string,
  receiverId: string,
): Promise<boolean> {
  const friendRequestQuery = query(
    collection(database, 'friend_requests'),
    or(
      where(documentId(), '==', `${senderId}_${receiverId}`),
      where(documentId(), '==', `${receiverId}_${senderId}`),
    ),
  );

  const check = await getCountFromServer(friendRequestQuery);

  return check.data().count > 0;
}

export async function createFriendRequest(
  senderData: FriendRequestUserData,
  receiverUsername: string,
) {
  // 1 - Get user document with matching username
  const receiverQuery = query(
    collection(database, 'users').withConverter(converter<User>()),
    where('username', '==', receiverUsername),
  );

  const receiverDoc = await getDocs(receiverQuery);

  // 2 - If no user is found, handle error/return
  if (receiverDoc.empty) {
    throw new Error(`User with username ${receiverUsername} not found`);
  }

  const { id: senderId } = senderData;
  const receiverId = receiverDoc.docs[0].data().id;

  // Check if friend-request already exists, if true, handle error/return
  if (await checkFriendRequest(senderId, receiverId)) {
    throw new Error(`Friend request already exists`);
  }

  const timestamp = Timestamp.now();

  const friendRequestData: FriendRequest = {
    id: `${senderId}_${receiverId}`,
    senderData,
    receiverData: {
      id: receiverId,
      displayName: receiverDoc.docs[0].data().displayName,
      username: receiverDoc.docs[0].data().username,
      avatarUrl: receiverDoc.docs[0].data().avatarUrl,
    },
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

export async function fetchUserFriendRequests(
  userId: string,
): Promise<FriendRequest[]> {
  const friendRequestQuery = query(
    collection(database, 'friend_requests').withConverter(
      converter<FriendRequest>(),
    ),
    or(
      where('senderData.id', '==', userId),
      where('receiverData.id', '==', userId),
    ),
  );

  const friendRequests = await getDocs(friendRequestQuery);

  return friendRequests.docs.map((doc) => doc.data());
}

export function subscribeToUserFriendRequests(
  userId: string,
  fn: (snapshot: FriendRequest[]) => void,
) {
  const friendRequestQuery = query(
    collection(database, 'friend_requests').withConverter(
      converter<FriendRequest>(),
    ),
    or(
      where('senderData.id', '==', userId),
      where('receiverData.id', '==', userId),
    ),
  );

  const unsubscribe = onSnapshot(friendRequestQuery, (doc) => {
    fn(doc.docs.map((doc) => doc.data()));
  });

  return unsubscribe;
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

import { type FriendRequest } from '@/types/models';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { CheckIcon, XIcon } from 'lucide-react';
import { updateFriendRequest } from '@/features/friend-requests';

type FriendRequestCardProps = {
  friendRequest: FriendRequest;
};

export function FriendRequestCard({ friendRequest }: FriendRequestCardProps) {
  async function handleUpdateFriendRequest(status: 'accepted' | 'rejected') {
    await updateFriendRequest(friendRequest, status);
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage
            src={friendRequest.senderData.avatarUrl}
            height={48}
            width={48}
            className="object-cover"
          />
          <AvatarFallback>
            {friendRequest.senderData.username.charAt(0).toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{friendRequest.senderData.displayName}</span>
          <span className="text-muted-foreground">
            {friendRequest.senderData.username}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => handleUpdateFriendRequest('accepted')}
          type="button"
          size="icon"
        >
          <CheckIcon />
        </Button>
        <Button
          onClick={() => handleUpdateFriendRequest('rejected')}
          type="button"
          variant="destructive"
          size="icon"
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}

import { FriendRequestUserData } from '@/types/models';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type FriendRequestCardProps = {
  friendRequest: FriendRequestUserData;
};

export function FriendRequestCard({ friendRequest }: FriendRequestCardProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-12">
        <AvatarImage
          src={friendRequest.avatarUrl}
          height={48}
          width={48}
          className="object-cover"
        />
        <AvatarFallback>
          {friendRequest.username.charAt(0).toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span>{friendRequest.displayName}</span>
        <span className="text-muted-foreground">{friendRequest.username}</span>
      </div>
    </div>
  );
}

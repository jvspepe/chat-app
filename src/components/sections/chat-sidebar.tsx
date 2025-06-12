import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useOutletContext } from 'react-router';
import { IAuthContext } from '@/contexts/auth/context';
import { FriendRequestDialog } from '../friend-request-dialog';

export function ChatSidebar() {
  const currentUser =
    useOutletContext<NonNullable<IAuthContext['currentUser']>>();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-12">
              <AvatarImage
                src={currentUser.photoURL ?? undefined}
                alt={`${currentUser.displayName ?? 'User'}'s Profile picture`}
                height={48}
                width={48}
              />
              <AvatarFallback>
                {!currentUser.displayName
                  ? 'U'
                  : currentUser.displayName
                      .split(' ')
                      .map((word) => word.charAt(0))
                      .join('')}
              </AvatarFallback>
            </Avatar>
            <span>{currentUser.displayName ?? 'User'}</span>
          </div>
          <FriendRequestDialog />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>Group</SidebarGroup>
        <SidebarGroup>Group</SidebarGroup>
      </SidebarContent>
      <SidebarFooter>Footer</SidebarFooter>
    </Sidebar>
  );
}

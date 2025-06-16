import { useNavigate, useOutletContext } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { IAuthContext } from '@/contexts/auth/context';
import { signOut } from '@/features/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FriendRequestDialog } from '@/components/friend-request-dialog';

export function ChatSidebar() {
  const currentUserData =
    useOutletContext<NonNullable<IAuthContext['currentUserData']>>();

  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    void navigate('/');
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-12">
              <AvatarImage
                src={currentUserData.avatarUrl}
                alt={`${currentUserData.displayName}'s profile picture`}
                height={48}
                width={48}
                className="object-cover"
              />
              <AvatarFallback>
                {!currentUserData.displayName
                  ? 'U'
                  : currentUserData.displayName
                      .split(' ')
                      .map((word) => word.charAt(0))
                      .join('')}
              </AvatarFallback>
            </Avatar>
            <span>{currentUserData.displayName}</span>
          </div>
          <FriendRequestDialog />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>Group</SidebarGroup>
        <SidebarGroup>Group</SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={handleSignOut}
          type="button"
        >
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

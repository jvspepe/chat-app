import { ChatSidebar } from '@/components/sections/chat-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export function MainLayout() {
  return (
    <SidebarProvider>
      <ChatSidebar />
    </SidebarProvider>
  );
}

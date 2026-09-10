import { NavMain } from '@/app/components/nav-main';
import { NavUser } from '@/app/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar';
import { useCurrentUser } from '@/app/features/auth/hooks';
import { CommandIcon, SpeedometerIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

const links = [
  {
    name: 'Dashboard',
    url: '/',
    icon: <SpeedometerIcon />,
  },
];

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const { data: currentUser } = useCurrentUser();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <CommandIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain links={links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser!} />
      </SidebarFooter>
    </Sidebar>
  );
}

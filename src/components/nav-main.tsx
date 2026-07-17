import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';

export default function NavMain({
  links,
}: {
  links: {
    name: string;
    url: string;
    icon: ReactNode;
  }[];
}) {
  const [location] = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>MAIN NAVIGATION</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              render={<Link href={item.url} />}
              isActive={location === item.url}
            >
              {item.icon}
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

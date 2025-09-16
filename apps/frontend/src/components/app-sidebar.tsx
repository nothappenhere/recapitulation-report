import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useUser } from "@/hooks/UserContext";
import { Link, NavLink } from "react-router";
import { capitalizeFirstLetter } from "@/lib/utils";

type NavConfig = {
  [role: string]: NavSection[];
};

type NavSection = {
  title: string;
  url: string;
  items: NavItem[];
};

type NavItem = {
  title: string;
  url: string;
};

const navConfig: NavConfig = {
  administrator: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        { title: "Harga Tiket", url: "harga-tiket" },
        { title: "Stok Tiket", url: "stok-tiket" },
      ],
    },
  ],
  user: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        { title: "Harga Tiket", url: "ticket-price" },
        { title: "Reservasi & Walk-in", url: "visits" },
        { title: "Target Tahunan", url: "targets" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const role = user?.role || "guest";
  const menuData = navConfig[role] || [];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-full">
                  <img src="/img/logo-mg.png" alt="Logo Museum Geologi" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Ticketing System</span>
                  <span className="text-xs">{capitalizeFirstLetter(role)}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuData.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className="font-medium">
                    {item.title}
                  </NavLink>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <NavLink to={sub.url} end>
                          {({ isActive }) => (
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                          )}
                        </NavLink>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={
            user || {
              _id: "12345",
              fullName: "Guest",
              username: "guest123",
              role: "guest role",
              avatar: "/avatars/default.jpg",
            }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

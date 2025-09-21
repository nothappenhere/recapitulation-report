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
import { NavUser } from "./NavUser";
import { useUser } from "@/hooks/UserContext";
import { Link, NavLink, useLocation } from "react-router";
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
        { title: "Pengelolaan Pengguna", url: "user-management" },
        { title: "Harga Tiket", url: "ticket-price" },
        { title: "Reservasi", url: "reservation" },
        { title: "Walk-in", url: "walk-in" },
        { title: "Kalender", url: "calendar" },
      ],
    },
  ],
  user: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        { title: "Harga Tiket", url: "ticket-price" },
        { title: "Reservasi", url: "reservation" },
        { title: "Walk-in", url: "walk-in" },
        { title: "Kalender", url: "calendar" },
        // { title: "Target Tahunan", url: "annual-target" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const role = user?.role || "guest";
  const menuData = navConfig[role] || [];
  const location = useLocation();

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
                  <span className="text-xs">
                    {capitalizeFirstLetter(user?.position || "Guest")}
                  </span>
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
                    {item.items.map((sub) => {
                      // buat path absolut agar match dengan location.pathname
                      const fullPath = `/dashboard/${sub.url}`;
                      const isActive = location.pathname.startsWith(fullPath);

                      return (
                        <SidebarMenuSubItem key={sub.title}>
                          <NavLink to={fullPath} end>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                          </NavLink>
                        </SidebarMenuSubItem>
                      );
                    })}
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
              position: "Guest",
              fullName: "Guest",
              username: "guest123",
              role: "Guest",
              avatar: "/avatars/default.jpg",
            }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

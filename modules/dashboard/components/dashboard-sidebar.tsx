"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Compass,
  Database,
  Flame,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Star,
  Terminal,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserButton from "@/modules/auth/components/user-button";

interface PlaygroundData {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  Flame,
  Terminal,
  Code2,
};

export function DashboardSidebar({
  initialPlaygroundData,
  canViewUsers,
}: {
  initialPlaygroundData: PlaygroundData[];
  canViewUsers: boolean;
}) {
  const pathname = usePathname();
  const [starredPlaygrounds] = useState(
    initialPlaygroundData.filter((playground) => playground.starred),
  );
  const [recentPlaygrounds] = useState(initialPlaygroundData);

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-1 border-r">
      <SidebarHeader>
        <div className="flex justify-center px-4 py-3">
          <Image src="/logo.svg" alt="logo" height={60} width={60} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Home">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/compiler"}
                tooltip="Compiler"
              >
                <Link href="/compiler">
                  <Terminal className="h-4 w-4" />
                  <span>Compiler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {canViewUsers ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/users"}
                  tooltip="Users"
                >
                  <Link href="/dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Star className="mr-2 h-4 w-4" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 &&
              recentPlaygrounds.length === 0 ? (
                <div className="w-full py-4 text-center text-muted-foreground">
                  Create your playground
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent = lucideIconMap[playground.icon] || Code2;

                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`}>
                          <IconComponent className="h-4 w-4" />
                          <span>{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="mr-2 h-4 w-4" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 &&
              recentPlaygrounds.length === 0
                ? null
                : recentPlaygrounds.map((playground) => {
                    const IconComponent =
                      lucideIconMap[playground.icon] || Code2;

                    return (
                      <SidebarMenuItem key={playground.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/playground/${playground.id}`}
                          tooltip={playground.name}
                        >
                          <Link href={`/playground/${playground.id}`}>
                            <IconComponent className="h-4 w-4" />
                            <span>{playground.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/coming-soon?feature=settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Account
                </p>
                <p className="truncate text-sm font-medium">Profile & Logout</p>
              </div>
              <UserButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

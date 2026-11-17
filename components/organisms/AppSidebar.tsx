"use client";

import { useStacks } from "@/hooks/useStacks";
import {
  Calendar,
  Diamond,
  Inbox,
  Layers,
  LayoutGrid,
  PanelLeftIcon,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "../ui/Sidebar";
import NewTaskDrawer from "./NewTaskDrawer";

const navMain = [
  {
    title: "Today",
    url: "/",
    icon: Sun,
    isActive: true,
  },
  {
    title: "Upcoming",
    url: "/upcoming",
    icon: Calendar,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: LayoutGrid,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {};

export default function AppSidebar({ ...props }: AppSidebarProps) {
  const { data: stacks } = useStacks();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="w-full overflow-hidden px-1 hover:bg-transparent">
              <div className="flex w-full items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 cursor-pointer items-center justify-center rounded-md">
                  <Diamond className="size-3" />
                </div>
                <span className="truncate font-medium">TaskTile</span>
                <div className="hover:bg-muted ml-auto cursor-pointer rounded-lg p-2">
                  <PanelLeftIcon />
                </div>
              </div>
            </SidebarTrigger>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem key="add-new-task">
            <NewTaskDrawer />
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {navMain.map((nav) => (
            <SidebarMenuItem key={nav.title}>
              <SidebarMenuButton
                isActive={nav.isActive}
                render={<Link href={nav.url} />}
              >
                <nav.icon />
                <span>{nav.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Stacks</SidebarGroupLabel>
          <SidebarMenu>
            {stacks?.map((stack) => {
              const href = "/stacks/" + stack.id;

              return (
                <SidebarMenuItem key={stack.id}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    render={<Link href={href} />}
                  >
                    <Layers />
                    <span>{stack.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

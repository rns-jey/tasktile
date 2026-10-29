"use client";

import { useCategories } from "@/hooks/useCategories";
import {
  Diamond,
  LayoutGrid,
  List,
  PanelLeftIcon,
  Settings,
  Square,
} from "lucide-react";
import Link from "next/link";
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

const navMain = [
  {
    title: "Today",
    url: "#",
    icon: Square,
    isActive: true,
  },
  {
    title: "Tasks",
    url: "#",
    icon: List,
  },
  {
    title: "Analytics",
    url: "#",
    icon: LayoutGrid,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    badge: "10",
  },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {};

export default function AppSidebar({ ...props }: AppSidebarProps) {
  const { data: categories } = useCategories();

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
                <div className="hover:bg-muted hover:text-paper ml-auto cursor-pointer rounded-lg p-2">
                  <PanelLeftIcon />
                </div>
              </div>
            </SidebarTrigger>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {navMain.map((nav) => (
            <SidebarMenuItem key={nav.title}>
              <SidebarMenuButton
                isActive={nav.isActive}
                render={<Link href={"#"} />}
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
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categories?.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton render={<Link href={"#"} />}>
                  <span
                    className="h-4 min-w-4 rounded-xs"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

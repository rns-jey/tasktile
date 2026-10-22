import { db } from "@/lib/db";
import { Profile } from "@/lib/generated/prisma/client";
import { Diamond, LayoutGrid, List, Settings, Square } from "lucide-react";
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

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  profile: Profile;
};

export default async function AppSidebar({
  profile,
  ...props
}: AppSidebarProps) {
  const categories = await db.category.findMany({
    where: { userId: profile.userID },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
            <Diamond className="size-3" />
          </div>
          <span className="truncate font-medium">TaskTile</span>
        </div>

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
            {categories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton render={<Link href={"#"} />}>
                  <span
                    className="h-2 w-2 rounded-xs"
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

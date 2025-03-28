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
} from "@/components/ui/sidebar";
import {
  BarChartIcon,
  CalendarIcon,
  CheckIcon,
  CircleIcon,
  ListIcon,
  LogOutIcon,
  PlusIcon,
} from "lucide-react";

import {
  SignOutButton,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";

import TagsSidebarGroup from "./tags-sidebar-group";
import Link from "next/link";
import CreateNewHabitButton from "./CreateNewHabitButton";
import { Button } from "./ui/button";

const mainItems = [
  {
    title: "All Habits",
    href: "/dashboard",
    icon: <ListIcon />,
  },
  {
    title: "Unfinished",
    href: "/dashboard?filter=unfinished",
    icon: <CircleIcon />,
  },
  {
    title: "Completed",
    href: "/dashboard?filter=completed",
    icon: <CheckIcon />,
  },
];
const statisticsItems = [
  {
    title: "Calendar",
    url: "/calendar",
    icon: <CalendarIcon />,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: <BarChartIcon />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-center gap-2">
        <img
          src="/assets/logo.png"
          alt="logo"
          className="w-10 h-10"
          width={1312}
          height={858}
        />
        <span className="text-2xl font-semibold">Habito</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <CreateNewHabitButton
                    label="+ New Habit"
                    className="hover:bg-black/85 hover:text-white active:bg-black/90 active:text-white"
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {/* <SidebarGroupLabel></SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <TagsSidebarGroup />

        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {statisticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut> */}
        <SignedIn>
          {/* <UserButton
              showName
              appearance={{
                layout: {
                  socialButtonsVariant: "iconButton",
                },
                variables: {
                  borderRadius: "0.5rem",
                },
                elements: {
                  actionCard: "w-full",
                  userButtonAvatarBox: "w-12 h-12 !important",
                  userButtonPopoverCard: "w-80 z-50",
                },
              }}
            /> */}

          <SignOutButton>
            <Button
              variant="ghost"
              className="w-full cursor-pointer"
              size="icon"
            >
              <LogOutIcon /> Sign Out
            </Button>
          </SignOutButton>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}

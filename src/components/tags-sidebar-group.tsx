"use client";
import { TagIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenu,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useAppState } from "@/hooks/useAppState";
import Link from "next/link";

export default function TagsSidebarGroup() {
  const { habits } = useAppState();
  const tags = Array.from(
    new Set(habits.map((habit) => habit.tags).flat())
  );

  if (tags.length === 0) return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Groups</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tags.map((tag) => (
            <SidebarMenuItem key={tag}>
              <SidebarMenuButton asChild>
                <Link
                  href={{
                    search: `tag=${tag}`,
                  }}
                >
                  <TagIcon />
                  <span>{tag}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
